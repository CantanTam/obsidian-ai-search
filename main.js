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

// 搜索框 (关键修改)
// 搜索框（完全重写交互逻辑）
class AISearchModal extends Modal {
    constructor(app, plugin, editor) {
        super(app);
        this.plugin = plugin;
        this.inputEl = null;
        this.resultArea = null;
        this.editor = editor;
        // 记录打开弹窗时的光标位置（用于后续插入文本）
        this.cursorPos = editor ? editor.getCursor() : null;

        // 事件处理器引用，用于移除监听
        this._globalKeyHandler = null;
        this._resultKeyHandler = null;
        this._beforeInputHandler = null;
        this._compositionHandler = null;
    }

    onOpen() {
        this.setupModalStyle();
        this.renderUI();
        this.bindEvents();

        // 自动聚焦输入框
        setTimeout(() => this.inputEl?.focus(), 50);
    }

    // 1. 初始化容器样式
    setupModalStyle() {
        const { modalEl } = this;
        modalEl.style.width = `${this.plugin.settings.modalWidth}px`;
        modalEl.style.height = `${this.plugin.settings.modalHeight}px`;
        modalEl.querySelector('.modal-close-button')?.remove();
        modalEl.parentElement.addClass('aisearch-overlay');
        modalEl.addClass('aisearch-modal');
        this.contentEl.addClass('aisearch-content');
    }

    // 2. 渲染静态 UI 组件
    renderUI() {
        // 输入区域
        const inputContainer = this.contentEl.createDiv({ cls: 'aisearch-input-container' });
        const inputWrapper = inputContainer.createDiv({ cls: 'aisearch-input-wrapper' });

        this.inputEl = inputWrapper.createEl('textarea', {
            cls: 'aisearch-input',
            attr: { placeholder: 'Shift + Enter 换行', rows: "1" }
        });

        // 清除按钮
        const clearBtn = inputWrapper.createDiv({ cls: 'aisearch-clear-btn clickable-icon' });
        setIcon(clearBtn, 'cross');
        setTooltip(clearBtn, '清空输入', { placement: 'top' });

        // 结果区域 (contenteditable，只读模式通过事件实现)
        this.resultArea = this.contentEl.createDiv({ cls: 'aisearch-result-area' });
        this.resultArea.setText('等待输入...');
        this.resultArea.setAttribute('tabindex', '0');
        this.resultArea.setAttribute('contenteditable', 'true');

        // 按钮事件
        clearBtn.addEventListener('click', () => this.resetInput());
    }

    // 3. 绑定事件（核心改造）
    bindEvents() {
        // 输入框自动调整高度
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

        // ========== 全局捕获：仅处理 triggerKey 和 Tab ==========
        this._globalKeyHandler = (e) => {
            const { settings } = this.plugin;

            // 按下触发键：关闭弹窗
            if (e.key === settings.triggerKey) {
                e.preventDefault();
                e.stopPropagation();
                this.close();
                return;
            }

            // Tab 键：在输入框和结果区域之间切换焦点
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

        // ========== 结果区域键盘处理 ==========
        this._resultKeyHandler = (e) => {
            // 只处理焦点在结果区域内的事件
            if (!this.resultArea.contains(document.activeElement)) return;

            const { settings } = this.plugin;
            const { upKey, downKey, leftKey, rightKey, sendKey } = settings;

            // 1. 允许所有 Ctrl/Meta 组合键（复制、粘贴等）
            if (e.ctrlKey || e.metaKey) return;

            // 2. 映射 IJKL 为方向键（使用 Selection API）
            const dirMap = {
                [leftKey]:  { direction: 'backward', granularity: 'character' },
                [rightKey]: { direction: 'forward',  granularity: 'character' },
                [upKey]:    { direction: 'backward', granularity: 'line' },
                [downKey]:  { direction: 'forward',  granularity: 'line' },
            };

            if (e.code in dirMap) {
                e.preventDefault();
                const { direction, granularity } = dirMap[e.code];
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    // shift 按下时扩展选区，否则移动光标
                    selection.modify(
                        e.shiftKey ? 'extend' : 'move',
                        direction,
                        granularity
                    );
                }
                return;
            }

            // 3. 发送键（Space）：将选中文本插入到原始光标位置
            if (e.code === sendKey) {
                e.preventDefault();
                const selectedText = window.getSelection().toString();
                if (selectedText && this.cursorPos && this.editor) {
                    this.editor.replaceRange(selectedText, this.cursorPos);
                }
                return;
            }

            // 4. 阻止所有可见字符输入（字母、数字、符号等）
            //    通过判断 key 的长度（单个字符键的 key 长度为 1，而功能键如 'Shift', 'ArrowLeft' 长度大于 1）
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
            }
            // 真实的功能键（ArrowUp, Home, End, PageUp 等）不做任何阻止，保持默认行为
        };
        this.resultArea.addEventListener('keydown', this._resultKeyHandler);

        // ========== 彻底阻止 contenteditable 的文字写入（包括输入法） ==========
        this._beforeInputHandler = (e) => {
            e.preventDefault();
        };
        this.resultArea.addEventListener('beforeinput', this._beforeInputHandler);

        // 额外安全措施：拦截 compositionstart 事件，避免输入法组合窗口弹出
        this._compositionHandler = (e) => {
            e.preventDefault();
        };
        this.resultArea.addEventListener('compositionstart', this._compositionHandler);
        this.resultArea.addEventListener('compositionupdate', this._compositionHandler);
    }

    // 4. 搜索业务逻辑（不变）
    async handleSearch() {
        const query = this.inputEl.value.trim();
        if (!query) return;

        const { apiKey, apiModel } = this.plugin.settings;
        if (!apiKey) {
            this.resultArea.setText("❌ 请先在插件设置中填写 API Key");
            return;
        }

        this.resetInput();
        this.resultArea.empty();
        const statusEl = this.resultArea.createDiv({ cls: 'aisearch-status' });
        statusEl.setText(`🚀 ${apiModel} 思考中...`);
        const responseEl = this.resultArea.createDiv({ cls: 'aisearch-response' });

        try {
            const answer = await this.fetchAI(query);
            statusEl.remove();
            await MarkdownRenderer.renderMarkdown(answer, responseEl, '', this.plugin);
        } catch (error) {
            statusEl.setText(`❌ 错误: ${this.getFriendlyErrorMessage(error.message)}`);
        }
    }

    // 5. API请求（不变）
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

    // 辅助方法
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
        // 移除所有事件监听，防止内存泄漏
        if (this._globalKeyHandler) {
            this.modalEl.removeEventListener('keydown', this._globalKeyHandler, true);
        }
        if (this._resultKeyHandler) {
            this.resultArea.removeEventListener('keydown', this._resultKeyHandler);
        }
        if (this._beforeInputHandler) {
            this.resultArea.removeEventListener('beforeinput', this._beforeInputHandler);
        }
        if (this._compositionHandler) {
            this.resultArea.removeEventListener('compositionstart', this._compositionHandler);
            this.resultArea.removeEventListener('compositionupdate', this._compositionHandler);
        }
        this.contentEl.empty();
    }
}