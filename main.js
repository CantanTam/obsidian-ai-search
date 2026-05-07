"use strict";

const { Plugin, Modal, setIcon, PluginSettingTab, Setting, MarkdownRenderer, requestUrl, setTooltip } = require('obsidian');

// 默认设置（已删除 selectKey）
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

// ------------------------------------------------------------
// 主插件类
// ------------------------------------------------------------
module.exports = class AISearchPlugin extends Plugin {
    async onload() {
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
                    const activeView = this.app.workspace.getActiveViewOfType(require('obsidian').MarkdownView);
                    const editor = activeView ? activeView.editor : null;
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

        this.addSettingTab(new AISearchSettingTab(this.app, this));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
};

// ------------------------------------------------------------
// 设置面板（已删除 selectKey 设置）
// ------------------------------------------------------------
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

        // 快捷键通用设置函数
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
        createKeySetting('模拟Right键', 'rightKey');
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

// ------------------------------------------------------------
// 弹窗类（已删除 selectKey 及相关逻辑）
// ------------------------------------------------------------
class AISearchModal extends Modal {
    constructor(app, plugin, editor) {
        super(app);
        this.plugin = plugin;
        this.editor = editor;
        this.cursorPos = editor ? editor.getCursor() : null;

        // 状态变量
        this.virtualCaret = null;           // 虚拟光标元素

        // 事件引用（用于解绑）
        this._globalKeyHandler = null;
        this._resultKeyHandler = null;
    }

    onOpen() {
        this.injectStyles();
        this.setupModalStyle();
        this.renderUI();
        this.bindEvents();
        setTimeout(() => this.inputEl?.focus(), 50);
    }

    // 必要的样式注入
    injectStyles() {
        if (document.getElementById('aisearch-plugin-styles')) return;
        const style = document.createElement('style');
        style.id = 'aisearch-plugin-styles';
        style.textContent = `
            .aisearch-result-area {
                position: relative;
                width: 100%;
                height: calc(100% - 100px);
                overflow-y: auto;
                background: var(--background-primary);
                border: 1px solid var(--background-modifier-border);
                border-radius: 4px;
                padding: 15px;
                user-select: text;
                cursor: text;
                line-height: 1.6;
                outline: none;
            }
            .aisearch-caret {
                position: absolute;
                width: 2px;
                background-color: var(--text-accent);
                pointer-events: none;
                display: none;
                z-index: 100;
                animation: aisearch-blink 1s infinite;
            }
            @keyframes aisearch-blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // 窗口尺寸和样式
    setupModalStyle() {
        const { modalEl } = this;
        modalEl.style.width = `${this.plugin.settings.modalWidth}px`;
        modalEl.style.height = `${this.plugin.settings.modalHeight}px`;
        modalEl.querySelector('.modal-close-button')?.remove();
        modalEl.parentElement.addClass('aisearch-overlay');
        modalEl.addClass('aisearch-modal');
        this.contentEl.addClass('aisearch-content');
    }

    // 渲染界面
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

        // 结果区不可编辑，仅用于显示和选区
        this.resultArea = this.contentEl.createDiv({
            cls: 'aisearch-result-area',
            attr: { tabindex: '0', contenteditable: 'false' }
        });

        this.virtualCaret = this.resultArea.createDiv({ cls: 'aisearch-caret' });
        this.resultArea.createDiv({ text: '等待输入...', attr: { style: 'color: var(--text-muted); opacity: 0.5;' } });

        clearBtn.addEventListener('click', () => {
            this.inputEl.value = '';
            this.inputEl.style.height = 'auto';
            this.inputEl.focus();
        });
    }

    // 事件绑定
    bindEvents() {
        // 输入框自动高度
        this.inputEl.addEventListener('input', () => {
            this.inputEl.style.height = 'auto';
            this.inputEl.style.height = `${this.inputEl.scrollHeight}px`;
        });

        // 回车搜索
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSearch();
            }
        });

        // 全局键：Alt 关闭，Tab 切换焦点
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
                    this.initSelection();
                    this.updateCaret();
                } else {
                    this.inputEl.focus();
                }
            }
        };
        this.modalEl.addEventListener('keydown', this._globalKeyHandler, true);

        // 结果区键盘处理（仅 Shift + IJKL 扩展选区）
        this._resultKeyHandler = (e) => {
            if (document.activeElement !== this.resultArea) return;
            const { settings } = this.plugin;

            const dirMap = {
                [settings.leftKey]:  ['backward', 'character'],
                [settings.rightKey]: ['forward', 'character'],
                [settings.upKey]:    ['backward', 'line'],
                [settings.downKey]:  ['forward', 'line'],
            };

            if (e.code in dirMap) {
                e.preventDefault();
                e.stopImmediatePropagation();

                const sel = window.getSelection();
                if (sel.rangeCount === 0 || !this.resultArea.contains(sel.anchorNode)) {
                    this.initSelection();
                }

                const [direction, granularity] = dirMap[e.code];
                const alterType = e.shiftKey ? 'extend' : 'move';  // 仅 Shift 键扩展选区
                sel.modify(alterType, direction, granularity);

                this.updateCaret();
                this.ensureVisible();
                return;
            }

            // 发送键
            if (e.code === settings.sendKey) {
                e.preventDefault();
                const selectedText = window.getSelection().toString();
                if (selectedText && this.editor) {
                    this.editor.replaceRange(selectedText, this.cursorPos);
                    this.close();
                }
                return;
            }
        };

        this.resultArea.addEventListener('keydown', this._resultKeyHandler, true);

        // 滚动或鼠标点击后更新虚拟光标
        this.resultArea.addEventListener('scroll', () => this.updateCaret());
        this.resultArea.addEventListener('mousedown', () => setTimeout(() => this.updateCaret(), 10));
    }

    // 初始化选区到结果区开头
    initSelection() {
        const range = document.createRange();
        range.selectNodeContents(this.resultArea);
        range.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    // 更新虚拟光标位置
    updateCaret() {
        const sel = window.getSelection();
        if (!sel.rangeCount || !this.resultArea.contains(sel.anchorNode)) {
            this.virtualCaret.style.display = 'none';
            return;
        }

        const range = sel.getRangeAt(0);
        if (!range.collapsed) {
            this.virtualCaret.style.display = 'none';
            return;
        }

        let rect = range.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
            const span = document.createElement('span');
            span.innerHTML = '&#8203;';
            range.insertNode(span);
            rect = span.getBoundingClientRect();
            span.remove();
        }

        const containerRect = this.resultArea.getBoundingClientRect();
        this.virtualCaret.style.display = 'block';
        this.virtualCaret.style.left = `${rect.left - containerRect.left + this.resultArea.scrollLeft}px`;
        this.virtualCaret.style.top = `${rect.top - containerRect.top + this.resultArea.scrollTop}px`;
        this.virtualCaret.style.height = `${rect.height || 20}px`;
    }

    // 自动滚动
    ensureVisible() {
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        const areaRect = this.resultArea.getBoundingClientRect();
        if (rect.bottom > areaRect.bottom) this.resultArea.scrollTop += (rect.bottom - areaRect.bottom) + 40;
        if (rect.top < areaRect.top) this.resultArea.scrollTop -= (areaRect.top - rect.top) + 40;
    }

    // 搜索
    async handleSearch() {
        const query = this.inputEl.value.trim();
        if (!query) return;

        const { apiKey, apiModel } = this.plugin.settings;
        if (!apiKey) {
            this.resultArea.empty();
            this.virtualCaret = this.resultArea.createDiv({ cls: 'aisearch-caret' });
            this.resultArea.createDiv({ text: "❌ 请先在插件设置中填写 API Key", attr: { style: 'color: var(--text-error);' } });
            return;
        }

        this.resultArea.empty();
        this.virtualCaret = this.resultArea.createDiv({ cls: 'aisearch-caret' });
        const statusEl = this.resultArea.createDiv({ cls: 'aisearch-status', text: `🚀 ${apiModel} 思考中...` });
        const responseEl = this.resultArea.createDiv({ cls: 'aisearch-response' });

        try {
            const answer = await this.fetchAI(query);
            statusEl.remove();
            await MarkdownRenderer.renderMarkdown(answer, responseEl, '', this.plugin);
            this.resultArea.focus();
            this.initSelection();
            this.updateCaret();
        } catch (error) {
            statusEl.setText(`❌ 错误: ${this.getFriendlyErrorMessage(error.message)}`);
        }
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

    getFriendlyErrorMessage(msg) {
        if (msg.includes("401")) return "API Key 错误";
        if (msg.includes("402")) return "余额不足";
        if (msg.includes("429")) return "频率过快";
        return msg;
    }

    onClose() {
        if (this._globalKeyHandler) this.modalEl.removeEventListener('keydown', this._globalKeyHandler, true);
        if (this._resultKeyHandler) this.resultArea.removeEventListener('keydown', this._resultKeyHandler, true);
        this.plugin.currentModal = null;
        this.contentEl.empty();
    }
}