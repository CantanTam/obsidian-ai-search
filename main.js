"use strict";

const { Plugin, Modal, setIcon, PluginSettingTab, Setting  } = require('obsidian');

// 设置选项
const DEFAULT_SETTINGS = {
    modalWidth: 600,
    modalHeight: 400,
    triggerKey: 'Alt',
    apiUrl: '',
    apiKey: '',
    apiModel: ''

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
                    const modal = new AISearchModal(this.app, this);

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
            .setDesc('选择双击哪个按键来唤起搜索框')
            .addDropdown(dropdown => dropdown
                .addOption('Alt', 'Alt')
                .addOption('Control', 'Ctrl')
                .setValue(this.plugin.settings.triggerKey)
                .onChange(async (value) => {
                    this.plugin.settings.triggerKey = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('窗口宽度')
            .setDesc('AI 搜索窗口宽度 (px)')
            .addSlider(slider => slider
                .setLimits(300, 1200, 10) // 最小值, 最大值, 步进
                .setValue(this.plugin.settings.modalWidth)
                .setDynamicTooltip()      // 显示当前数值
                .onChange(async (value) => {
                    this.plugin.settings.modalWidth = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('窗口高度')
            .setDesc('AI 搜索窗口高度 (px)')
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
    }
}

// 搜索框
class AISearchModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl, modalEl } = this;

        modalEl.style.width = this.plugin.settings.modalWidth + "px";
        modalEl.style.height = this.plugin.settings.modalHeight + "px";

        // 移除默认关闭按钮
        modalEl.querySelector('.modal-close-button')?.remove();

        modalEl.parentElement.addClass('aisearch-overlay');
        modalEl.addClass('aisearch-modal');
        contentEl.addClass('aisearch-content');

        // 输入区域（带清除按钮）
        const inputContainer = contentEl.createDiv({ cls: 'aisearch-input-container' });

        const inputWrapper = inputContainer.createDiv({ cls: 'aisearch-input-wrapper' });

        const inputEl = inputWrapper.createEl('textarea', {
            cls: 'aisearch-input',
            attr: {
                placeholder: 'AI 搜索...',
                rows: "1"
            }
        });

        inputEl.addEventListener('input', function() {
            this.style.height = 'auto'; 
            this.style.height = (this.scrollHeight) + 'px'; 
        });

        const clearBtn = inputWrapper.createDiv({
            cls: 'aisearch-clear-btn clickable-icon'
        });

        setIcon(clearBtn, 'cross');

        clearBtn.addEventListener('click', () => {
            inputEl.value = '';
            inputEl.focus();
        });

        setTimeout(() => inputEl.focus(), 50);

        // 结果区域
        const resultArea = contentEl.createDiv({ cls: 'aisearch-result-area' });
        resultArea.setText('等待输入...');

        inputEl.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // 阻止默认的换行

                const query = inputEl.value.trim();
            
                if (query === "") return;

                const { apiUrl, apiKey, apiModel } = this.plugin.settings;

                if (!apiKey) {
                    resultArea.setText("❌ 请先在插件设置中填写 API Key");
                    return;
                }

                // 立即清空输入框并显示状态
                inputEl.value = "";

                inputEl.style.height = 'auto'; 

                resultArea.empty();
                const statusEl = resultArea.createDiv({ cls: 'aisearch-status' });
                statusEl.setText(`🚀 ${apiModel} 思考中...`);
                
                const responseEl = resultArea.createDiv({ cls: 'aisearch-response' });
                responseEl.style.whiteSpace = "pre-wrap";

                try {
                    const { requestUrl } = require('obsidian'); 
                    
                    // 参照官方文档：Base URL 为 https://api.deepseek.com
                    const response = await requestUrl({
                        url: apiUrl,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey.trim()}`
                        },
                        body: JSON.stringify({
                            model: apiModel, // deepseek-v4-flash 或 deepseek-v4-pro
                            messages: [
                                { role: "system", content: "你是一个集成在 Obsidian 笔记软件中的 AI 助手。请提供专业、简洁且准确的回答。" },
                                { role: "user", content: query }
                            ],
                            stream: false,
                            // 官方建议：可以通过 max_tokens 控制返回长度，节省额度
                            max_tokens: 2048,
                            temperature: 0.7
                        })
                    });

                    const result = response.json;

                    if (result.error) {
                        throw new Error(result.error.message);
                    }

                    if (result.choices && result.choices.length > 0) {
                        statusEl.remove(); // 移除思考状态
                        const answer = result.choices[0].message.content;
                        const { MarkdownRenderer } = require('obsidian');

                        responseEl.empty(); 

                        await MarkdownRenderer.renderMarkdown(answer, responseEl, '', this.plugin);
                    }

                } catch (error) {
                    console.error("DeepSeek API Error:", error);
                    // 针对官方常见错误码的处理
                    let errorMsg = error.message;
                    if (errorMsg.includes("401")) errorMsg = "API Key 错误或失效";
                    if (errorMsg.includes("402")) errorMsg = "账户余额不足";
                    if (errorMsg.includes("429")) errorMsg = "请求太快了，请稍后再试";
                    
                    resultArea.setText(`❌ 发生错误: ${errorMsg}`);
                }
            }
        });
    }

    onClose() {
        this.contentEl.empty();
    }
}