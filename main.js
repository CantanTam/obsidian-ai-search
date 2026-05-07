"use strict";

const { Plugin, Modal, setIcon, PluginSettingTab, Setting, MarkdownRenderer, requestUrl, setTooltip } = require('obsidian');

// 设置选项
const DEFAULT_SETTINGS = {
    modalWidth: 600,
    modalHeight: 400,
    triggerKey: 'Alt',
    apiUrl: '',
    apiKey: '',
    apiModel: '',
    apiMaxToken: 2048,
    apiTemperature: 0.8,
    upKey: 'KeyI',
    downKey: 'KeyK',
    leftKey: 'KeyJ',
    rightKey: 'KeyL',
    sendKey: 'Space',
};

module.exports = class AISearchPlugin extends Plugin {
    async onload() {
        // 加载设置
        await this.loadSettings();

        this.lastTriggerTime = 0;
        this.currentModal = null;

        this.registerDomEvent(document, 'keydown', (evt) => {
            if (evt.key === this.settings.triggerKey) {

                if (this.currentModal) {
                    this.currentModal.close();
                    this.currentModal = null;
                    this.lastTriggerTime = 0;
                    return;
                }

                const currentTime = Date.now();
                const timeDiff = currentTime - this.lastTriggerTime;

                if (timeDiff > 0 && timeDiff < 300) {
                    // 1. 在打开弹窗前，先抓取当前活跃的编辑器，并记录光标位置
                    const activeView = this.app.workspace.getActiveViewOfType(require('obsidian').MarkdownView);
                    const editor = activeView ? activeView.editor : null;
                    // 光标位置将在 Modal 构造函数内部自动保存

                    const modal = new AISearchModal(this.app, this, editor);

                    const originalClose = modal.close.bind(modal);
                    modal.close = () => {
                        originalClose();
                        this.currentModal = null;
                    };

                    this.currentModal = modal;
                    modal.open();
                    this.lastTriggerTime = 0;
                } else {
                    this.lastTriggerTime = currentTime;
                }
            }
        });

        // 添加设置选项卡
        this.addSettingTab(new AISearchSettingTab(this.app, this));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
};

// 设置页面 (未改动)
class AISearchSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: '快捷键设置' });

        // 触发按键
        new Setting(containerEl)
            .setName('触发按键')
            .addDropdown(dropdown => dropdown
                .addOption('Alt', 'Alt')
                .addOption('Control', 'Ctrl')
                .setValue(this.plugin.settings.triggerKey)
                .onChange(async (value) => {
                    this.plugin.settings.triggerKey = value;
                    await this.plugin.saveSettings();
                }));

        // 快捷键通用函数
        const createKeySetting = (name, settingsKey) => {
            new Setting(containerEl)
                .setName(name)
                .addText(text => {
                    const inputEl = text.inputEl;
                    inputEl.value = this.plugin.settings[settingsKey];
                    inputEl.style.cursor = 'pointer';
                    inputEl.style.textAlign = 'center';
                    inputEl.style.width = '100px';

                    inputEl.addEventListener('keydown', async (e) => {
                        e.preventDefault();
                        const newCode = e.code; 
                        text.setValue(newCode);
                        this.plugin.settings[settingsKey] = newCode;
                        await this.plugin.saveSettings();
                        inputEl.blur();
                    });
                });
        };

        createKeySetting('模拟Up键', 'upKey');
        createKeySetting('模拟Down键', 'downKey');
        createKeySetting('模拟Left键', 'leftKey');
        createKeySetting('模拟right键', 'rightKey');
        createKeySetting('发送按键', 'sendKey');

        containerEl.createEl('h2', { text: '弹窗大小设置' });

        new Setting(containerEl)
            .setName('窗口宽度')
            .addSlider(slider => slider
                .setLimits(300, 1200, 10)
                .setValue(this.plugin.settings.modalWidth)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.modalWidth = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('窗口高度')
            .addSlider(slider => slider
                .setLimits(200, 800, 10)
                .setValue(this.plugin.settings.modalHeight)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.modalHeight = value;
                    await this.plugin.saveSettings();
                }));

        containerEl.createEl('h2', { text: 'API设置' });

        new Setting(containerEl)
            .setName('服务器地址')
            .addText(text => text
                .setValue(this.plugin.settings.apiUrl)
                .onChange(async (value) => {
                    this.plugin.settings.apiUrl = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('API Key')
            .addText(text => text
                .setPlaceholder('sk-...')
                .setValue(this.plugin.settings.apiKey)
                .onChange(async (value) => {
                    this.plugin.settings.apiKey = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('模型类型')
            .addText(text => text
                .setValue(this.plugin.settings.apiModel)
                .onChange(async (value) => {
                    this.plugin.settings.apiModel = value;
                    await this.plugin.saveSettings();
                }));    
                
        new Setting(containerEl)
            .setName('输出长度上限')
            .setDesc('数值越小越节约token数')
            .addSlider(slider => slider
                .setLimits(100, 5000, 100)
                .setValue(this.plugin.settings.apiMaxToken)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.apiMaxToken = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('采样温度')
            .setDesc('数值越小越精准，数值越大越有创意')
            .addSlider(slider => slider
                .setLimits(0, 2, 0.1)
                .setValue(this.plugin.settings.apiTemperature)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.apiTemperature = value;
                    await this.plugin.saveSettings();
                }));
    }
}

// 搜索框（针对 Linux/Windows 输入法优化的 IJKL 选区版本）
class AISearchModal extends Modal {
    constructor(app, plugin, editor) {
        super(app);
        this.plugin = plugin;
        this.inputEl = null;
        this.resultArea = null;
        this.editor = editor;
        this.cursorPos = editor ? editor.getCursor() : null;

        // 保存结果区域的「干净内容」，用于恢复
        this._cleanHTML = '';

        // 事件处理器引用
        this._globalKeyHandler = null;
        this._resultKeyHandler = null;
        this._beforeInputHandler = null;
        this._inputHandler = null;
        this._compositionHandler = null;
    }

    onOpen() {
        this.setupModalStyle();
        this.renderUI();
        this.bindEvents();
        this._cleanHTML = this.resultArea.innerHTML;
        setTimeout(() => this.inputEl?.focus(), 50);
    }

    setupModalStyle() {
        const { modalEl } = this;
        modalEl.style.width = `${this.plugin.settings.modalWidth}px`;
        modalEl.style.height = `${this.plugin.settings.modalHeight}px`;
        modalEl.querySelector('.modal-close-button')?.remove();
        modalEl.parentElement.addClass('aisearch-overlay');
        modalEl.addClass('aisearch-modal');
        this.contentEl.addClass('aisearch-content');
    }

    renderUI() {
        const inputContainer = this.contentEl.createDiv({ cls: 'aisearch-input-container' });
        const inputWrapper = inputContainer.createDiv({ cls: 'aisearch-input-wrapper' });

        this.inputEl = inputWrapper.createEl('textarea', {
            cls: 'aisearch-input',
            attr: { placeholder: 'Shift + Enter 换行', rows: "1" }
        });

        const clearBtn = inputWrapper.createDiv({ cls: 'aisearch-clear-btn clickable-icon' });
        setIcon(clearBtn, 'cross');
        setTooltip(clearBtn, '清空输入', { placement: 'top' });

        // 结果区域：设置为只读属性的 contenteditable
        this.resultArea = this.contentEl.createDiv({
            cls: 'aisearch-result-area',
            attr: {
                contenteditable: 'true',
                tabindex: '0',
                spellcheck: 'false',
                autocomplete: 'off',
                inputmode: 'none', // 移动端防御
            }
        });
        this.resultArea.setText('等待输入...');

        clearBtn.addEventListener('click', () => this.resetInput());
    }

    bindEvents() {
        // 输入框高度自动调整
        this.inputEl.addEventListener('input', () => {
            this.inputEl.style.height = 'auto';
            this.inputEl.style.height = `${this.inputEl.scrollHeight}px`;
        });

        // 输入框回车发送
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSearch();
                this.resultArea.focus();
            }
        });

        // ========== 全局：triggerKey 关闭、Tab 切换焦点 ==========
        this._globalKeyHandler = (e) => {
            const { settings } = this.plugin;
            if (e.key === settings.triggerKey) {
                e.preventDefault();
                e.stopPropagation();
                this.close();
                return;
            }
            if (e.key === 'Tab') {
                e.preventDefault();
                e.stopPropagation();
                if (document.activeElement === this.inputEl) {
                    this.resultArea.focus();
                } else {
                    this.inputEl.focus();
                }
            }
        };
        this.modalEl.addEventListener('keydown', this._globalKeyHandler, true);

        // ========== 结果区域：核心方向键与选区逻辑 ==========
        this._resultKeyHandler = (e) => {
            if (!this.resultArea.contains(document.activeElement)) return;

            const { settings } = this.plugin;
            const { upKey, downKey, leftKey, rightKey, sendKey } = settings;

            // 允许原生组合键（如 Ctrl+C）
            if (e.ctrlKey || e.metaKey) return;

            const dirMap = {
                [leftKey]:  { direction: 'backward', granularity: 'character' },
                [rightKey]: { direction: 'forward',  granularity: 'character' },
                [upKey]:    { direction: 'backward', granularity: 'line' },
                [downKey]:  { direction: 'forward',  granularity: 'line' },
            };

            // 使用 e.code 判定物理按键，不受输入法状态影响
            if (e.code in dirMap) {
                e.preventDefault();
                e.stopImmediatePropagation(); // 强行截断，不让输入法捕捉

                const { direction, granularity } = dirMap[e.code];
                const sel = window.getSelection();
                if (sel.rangeCount > 0) {
                    // 显式根据 Shift 状态决定是 'extend' 还是 'move'
                    const alterType = e.shiftKey ? 'extend' : 'move';
                    sel.modify(alterType, direction, granularity);
                }
                return;
            }

            if (e.code === sendKey) {
                e.preventDefault();
                e.stopImmediatePropagation();
                const selectedText = window.getSelection().toString();
                if (selectedText && this.cursorPos && this.editor) {
                    this.editor.replaceRange(selectedText, this.cursorPos);
                }
                return;
            }

            // 阻止所有普通字符输入，防止在中文输入法状态下字符上屏
            if (e.key.length === 1) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        };
        // 使用 capture 阶段 (true)，确保在输入法干预前拦截
        this.resultArea.addEventListener('keydown', this._resultKeyHandler, true);

        // ========== 防御层：彻底屏蔽 IME 合成窗口 ==========
        this._compositionHandler = (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (e.type === 'compositionstart') {
                // 瞬间失去焦点再重新获得焦点，可以强行关闭已经弹出的输入法窗口
                this.resultArea.blur();
                this.resultArea.focus();
            }
        };
        this.resultArea.addEventListener('compositionstart', this._compositionHandler, true);
        this.resultArea.addEventListener('compositionupdate', this._compositionHandler, true);

        // ========== 防御层：阻止任何形式的内容变更 ==========
        this._beforeInputHandler = (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
        };
        this.resultArea.addEventListener('beforeinput', this._beforeInputHandler, true);

        // ========== 兜底层：内容恢复机制 ==========
        this._inputHandler = () => {
            const sel = window.getSelection();
            let startOffset = 0, endOffset = 0;
            if (sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                startOffset = this._getTextOffset(range.startContainer, range.startOffset);
                endOffset = this._getTextOffset(range.endContainer, range.endOffset);
            }

            this.resultArea.innerHTML = this._cleanHTML;

            try {
                const newRange = this._createRangeFromOffsets(startOffset, endOffset);
                if (newRange) {
                    sel.removeAllRanges();
                    sel.addRange(newRange);
                }
            } catch (err) {
                const fallbackRange = document.createRange();
                fallbackRange.setStart(this.resultArea, 0);
                fallbackRange.collapse(true);
                sel.removeAllRanges();
                sel.addRange(fallbackRange);
            }
        };
        this.resultArea.addEventListener('input', this._inputHandler);
    }

    _getTextOffset(node, offset) {
        let count = 0;
        const walker = document.createTreeWalker(this.resultArea, NodeFilter.SHOW_TEXT, null, false);
        let currentNode;
        while ((currentNode = walker.nextNode())) {
            if (currentNode === node) return count + offset;
            count += currentNode.textContent.length;
        }
        return count;
    }

    _createRangeFromOffsets(start, end) {
        if (start < 0 || end < start) return null;
        const range = document.createRange();
        let foundStart = false, foundEnd = false;
        let count = 0;
        const walker = document.createTreeWalker(this.resultArea, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            const nodeLen = node.textContent.length;
            if (!foundStart && count + nodeLen >= start) {
                range.setStart(node, Math.min(start - count, nodeLen));
                foundStart = true;
            }
            if (!foundEnd && count + nodeLen >= end) {
                range.setEnd(node, Math.min(end - count, nodeLen));
                foundEnd = true;
                break;
            }
            count += nodeLen;
        }
        return (foundStart && foundEnd) ? range : null;
    }

    async handleSearch() {
        const query = this.inputEl.value.trim();
        if (!query) return;

        const { apiKey, apiModel } = this.plugin.settings;
        if (!apiKey) {
            this.resultArea.setText("❌ 请先在插件设置中填写 API Key");
            this._cleanHTML = this.resultArea.innerHTML;
            return;
        }

        this.resetInput();
        this.resultArea.empty();
        const statusEl = this.resultArea.createDiv({ cls: 'aisearch-status' });
        statusEl.setText(`🚀 ${apiModel} 思考中...`);
        const responseEl = this.resultArea.createDiv({ cls: 'aisearch-response' });
        this._cleanHTML = this.resultArea.innerHTML;

        try {
            const answer = await this.fetchAI(query);
            statusEl.remove();
            await MarkdownRenderer.renderMarkdown(answer, responseEl, '', this.plugin);
        } catch (error) {
            statusEl.setText(`❌ 错误: ${this.getFriendlyErrorMessage(error.message)}`);
        }
        this._cleanHTML = this.resultArea.innerHTML;
    }

    async fetchAI(query) {
        const { apiUrl, apiKey, apiModel, apiMaxToken, apiTemperature } = this.plugin.settings;
        const response = await requestUrl({
            url: apiUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
                model: apiModel,
                messages: [
                    { role: "system", content: "你是一个集成在 Obsidian 中的 AI 助手。" },
                    { role: "user", content: query }
                ],
                max_tokens: apiMaxToken,
                temperature: apiTemperature,
                stream: false
            })
        });
        const result = response.json;
        if (result.error) throw new Error(result.error.message);
        return result.choices[0].message.content;
    }

    resetInput() {
        this.inputEl.value = '';
        this.inputEl.style.height = 'auto';
        this.inputEl.focus();
    }

    getFriendlyErrorMessage(msg) {
        if (msg.includes("401")) return "API Key 错误";
        if (msg.includes("402")) return "余额不足";
        if (msg.includes("429")) return "频率过快";
        return msg;
    }

    onClose() {
        if (this._globalKeyHandler)   this.modalEl.removeEventListener('keydown', this._globalKeyHandler, true);
        if (this._resultKeyHandler)   this.resultArea.removeEventListener('keydown', this._resultKeyHandler, true);
        if (this._beforeInputHandler) this.resultArea.removeEventListener('beforeinput', this._beforeInputHandler, true);
        if (this._inputHandler)       this.resultArea.removeEventListener('input', this._inputHandler);
        if (this._compositionHandler) {
            this.resultArea.removeEventListener('compositionstart', this._compositionHandler, true);
            this.resultArea.removeEventListener('compositionupdate', this._compositionHandler, true);
        }
        this.contentEl.empty();
    }
}