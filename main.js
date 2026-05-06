"use strict";

const { Plugin, Modal, setIcon, PluginSettingTab, Setting  } = require('obsidian');

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
                    // 1. 在打开弹窗前，先抓取当前活跃的编辑器
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

// 设置页面
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
                    inputEl.style.width = '100px'; // 建议固定宽度，视觉上更像按钮

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

        // --- 2. 然后直接调用它们 ---
        containerEl.createEl('h2', { text: '弹窗大小设置' }); // 添加个小标题

        new Setting(containerEl)
            .setName('窗口宽度')
            .addSlider(slider => slider
                .setLimits(300, 1200, 10) // 最小值, 最大值, 步进
                .setValue(this.plugin.settings.modalWidth)
                .setDynamicTooltip()      // 显示当前数值
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
            .setDesc('数值越小越精准，数值越大越越有创意')
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

// 搜索框
class AISearchModal extends Modal {
    constructor(app, plugin, editor) {
        super(app);
        this.plugin = plugin;
        this.inputEl = null;
        this.resultArea = null;
        this.editor = editor;
    }

    onOpen() {
        this.setupModalStyle();
        this.renderUI();
        this.bindEvents();
        
        // 自动聚焦
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
        const { setTooltip } = require('obsidian');
        setTooltip(clearBtn, '清空输入', { placement: 'top' });

        // 结果区域
        this.resultArea = this.contentEl.createDiv({ cls: 'aisearch-result-area' });
        this.resultArea.setText('等待输入...');
        this.resultArea.setAttribute('tabindex', '0');

        this.resultArea.setAttribute('contenteditable', 'true'); 

        // 按钮点击事件（简单逻辑直接写，复杂逻辑拆出）
        clearBtn.addEventListener('click', () => this.resetInput());
    }

    // 3. 绑定复杂的交互事件
    bindEvents() {
        // 高度自动调整
        this.inputEl.addEventListener('input', () => {
            this.inputEl.style.height = 'auto';
            this.inputEl.style.height = `${this.inputEl.scrollHeight}px`;
        });

        // 回车发送
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();

                this.handleSearch();

                this.resultArea.focus(); 
            }
        });
    }

    // 4. 搜索业务逻辑：协调 UI 与 API
    async handleSearch() {
        const query = this.inputEl.value.trim();
        if (!query) return;

        const { apiKey, apiModel } = this.plugin.settings;
        if (!apiKey) {
            this.resultArea.setText("❌ 请先在插件设置中填写 API Key");
            return;
        }

        // UI 状态切换
        this.resetInput(); // 发送后清空输入框高度
        this.resultArea.empty();
        const statusEl = this.resultArea.createDiv({ cls: 'aisearch-status' });
        statusEl.setText(`🚀 ${apiModel} 思考中...`);
        const responseEl = this.resultArea.createDiv({ cls: 'aisearch-response' });

        try {
            const answer = await this.fetchAI(query);
            statusEl.remove();
            
            const { MarkdownRenderer } = require('obsidian');
            await MarkdownRenderer.renderMarkdown(answer, responseEl, '', this.plugin);
        } catch (error) {
            statusEl.setText(`❌ 错误: ${this.getFriendlyErrorMessage(error.message)}`);
        }
    }

    // 5. 核心 API 请求（纯逻辑，不涉及 UI 渲染）
    async fetchAI(query) {
        const { requestUrl } = require('obsidian');
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
                max_tokens: apiMaxToken,   // 限制回复长度
                temperature: apiTemperature,
                stream: false       // 禁用流式传输
            })
        });

        const result = response.json;
        if (result.error) throw new Error(result.error.message);
        return result.choices[0].message.content;
    }

    // 在 handleSearch 后面添加这个业务逻辑
    insertSelectedText() {
        // 如果打开插件时没在编辑器里，或者没有选中文本，直接返回
        if (!this.editor) return;

        const selectedText = window.getSelection().toString();
        if (selectedText) {
            // 在背景的 Obsidian 编辑器中插入选中的内容
            this.editor.replaceSelection(selectedText);
        }
    }

    // 辅助方法：重置输入框
    resetInput() {
        this.inputEl.value = '';
        this.inputEl.style.height = 'auto';
        this.inputEl.focus();
    }

    // 辅助方法：错误码翻译
    getFriendlyErrorMessage(msg) {
        if (msg.includes("401")) return "API Key 错误";
        if (msg.includes("402")) return "余额不足";
        if (msg.includes("429")) return "频率过快";
        return msg;
    }

    onClose() {
        this.contentEl.empty();
    }
}
