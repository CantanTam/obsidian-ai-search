"use strict";

// deepseek 图标
const DEEPSEEK_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M23.748 4.652c-.254-.125-.363.113-.512.233-.05.039-.093.09-.136.136-.372.397-.806.658-1.373.627-.829-.047-1.537.213-2.163.848-.133-.782-.575-1.249-1.247-1.548-.352-.156-.708-.312-.954-.65-.173-.241-.22-.51-.305-.775-.055-.159-.11-.323-.294-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.634 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.218-.329.14-.57-.233-1.14-.641-1.645-1.135-.857-.829-1.631-1.743-2.597-2.459a11.287 11.287 0 00-.688-.47c-.986-.957.129-1.743.387-1.836.27-.097.094-.432-.778-.428-.873.004-1.67.296-2.687.685-.149.058-.306.1-.466.136-.923-.175-1.882-.214-2.883-.101-1.885.21-3.39 1.1-4.497 2.622C.082 8.776-.231 10.853.152 13.02c.403 2.284 1.568 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.058 1.236-.031 1.705-.128.735-.156.685-.837.418-.961-2.155-1.004-1.681-.595-2.112-.926 1.095-1.296 2.746-2.642 3.391-7.003.05-.346.008-.564 0-.844-.004-.171.035-.237.23-.257.54-.062 1.064-.21 1.545-.475 1.397-.762 1.96-2.015 2.093-3.517.02-.23-.004-.467-.246-.587zM11.58 18.168c-2.088-1.642-3.101-2.183-3.52-2.16-.39.024-.32.471-.234.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.396-1.842-.16-1.897-.187-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.591.504-.094 1.024-.113 1.529-.04 2.132.311 3.946 1.265 5.468 2.775.868.86 1.525 1.887 2.202 2.89.72 1.066 1.494 2.082 2.48 2.915.348.291.625.513.891.677-.802.089-2.139.109-3.054-.615zm1.01-6.514c.033-.134.154-.232.3-.232.037 0 .073.007.106.02.043.015.082.039.113.074.055.054.086.132.086.214 0 .171-.137.307-.309.307-.168 0-.301-.114-.301-.256.001-.045.002-.085.005-.126zm3 1.71c-.166.063-.33.113-.49.12-.297.015-.622-.105-.798-.253-.274-.23-.47-.358-.552-.76-.035-.17-.015-.435.016-.587.07-.327-.008-.537-.239-.727-.188-.156-.426-.199-.688-.199-.098 0-.188-.042-.254-.077-.11-.055-.2-.191-.114-.358.027-.055.16-.187.192-.21.356-.203.767-.136 1.146.015.352.144.618.409 1.001.782.391.451.461.576.684.914.176.265.336.537.446.848.056.163.005.301-.149.399-.062.04-.134.067-.203.093z"/>
</svg>`;

const HUNYUAN_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path fill-rule="evenodd" d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm1.652 1.123l-.01-.001c.533.097 1.023.233 1.41.404 6.084 2.683 7.396 9.214 1.601 14.338a3.781 3.781 0 01-5.337-.328 3.654 3.654 0 01-.884-3.044c-1.934.6-3.295 2.305-3.524 4.45-.204 1.912.324 4.044 2.056 5.634L9.209 22.643C10.1 22.876 11.036 23 12 23c6.075 0 11-4.925 11-11 0-5.513-4.056-10.08-9.348-10.877zm-10.904 5.087c-.178.269-.348.536-.51.803l-.235.394.078-.167A10.957 10.957 0 001 12c0 4.919 3.228 9.083 7.682 10.49l.214.065C3.523 18.528 2.84 14.149 6.47 8.68A2.234 2.234 0 102.748 6.21zm10.157-5.172c4.408 1.33 3.61 5.41 2.447 6.924-1.86 1.155-3.922 1.498-4.708 2.276-.666.657-1.077 1.462-1.212 2.291A5.303 5.303 0 0112 12.258a5.672 5.672 0 001.404-11.169 10.51 10.51 0 00-.5-.052z"/>
</svg>`;

const QWEN_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path fill-rule="nonzero" d="M12.659 0.371c0.429 0.753 0.855 1.508 1.28 2.264a0.196 0.196 0 001.171 0.099h6.057c0.19 0 0.351 0.12 0.487 0.357l1.586 2.803c0.207 0.368 0.262 0.521 0.026 0.913-0.284 0.469-0.56 0.942-0.829 1.418l-0.4 0.718c-0.116 0.214-0.244 0.305-0.044 0.558l2.893 5.059c0.188 0.328 0.121 0.539-0.047 0.84-0.477 0.856-0.962 1.706-1.456 2.553-0.174 0.297-0.384 0.409-0.742 0.403-0.848-0.017-1.693-0.011-2.539 0.017a0.108 0.108 0 00-0.088 0.055 627.371 627.371 0 01-2.951 5.171c-0.184 0.32-0.414 0.396-0.791 0.397-1.088 0.003-2.184 0.004-3.291 0.002a0.586 0.586 0 01-0.546-0.354l-1.456-2.534a0.098 0.098 0 00-0.091-0.053H4.344c-0.311 0.033-0.603-0.001-0.878-0.1L1.718 17.993a0.592 0.592 0 01-0.002-0.589l1.317-2.313a0.216 0.216 0 000-0.215 601.03 601.03 0 01-2.045-3.569L0.125 9.786c-0.175-0.339-0.189-0.542 0.104-1.053 0.507-0.887 1.011-1.773 1.513-2.658 0.144-0.255 0.332-0.364 0.637-0.365a369.05 369.05 0 012.824-0.001 0.135 0.135 0 00.117-0.069L8.38 0.3A0.532 0.532 0 018.841 0.032c0.572-0.001 1.149 0 1.727-0.007l1.109-0.025c0.373-0.004 0.79 0.034 0.983 0.37zM8.915 0.811a0.065 0.065 0 00-0.057 0.033L5.732 6.314a0.171 0.171 0 01-0.147 0.085H2.458c-0.061 0-0.076 0.027-0.045 0.08l6.339 11.08c0.027 0.046 0.014 0.068-0.037 0.069l-3.049 0.016a0.238 0.238 0 00-0.218 0.127l-1.44 2.463c-0.048 0.085-0.023 0.129 0.074 0.129l6.236 0.009c0.05 0 0.087 0.021 0.113 0.066l1.531 2.677c0.05 0.088 0.1 0.089 0.152 0l5.461-9.556 0.854-1.508a0.06 0.06 0 011.105 0l1.553 2.76a0.133 0.133 0 00.117 0.068l3.014-0.022a0.044 0.044 0 00.038-0.022 0.045 0.045 0 000-0.044L20.092 9.3a0.118 0.118 0 010-0.123l0.32-0.553 1.221-2.157c0.026-0.045 0.013-0.068-0.038-0.068H8.946c-0.064 0-0.08-0.028-0.047-0.084l1.564-2.733a0.117 0.117 0 000-0.124L8.973 0.845a0.065 0.065 0 00-0.058-0.034zM15.777 9.56c0.05 0 0.063 0.022 0.037 0.065l-0.908 1.598-2.85 5.002a0.061 0.061 0 01-0.055 0.032 0.063 0.063 0 01-0.055-0.032L8.18 9.645c-0.022-0.037-0.011-0.057 0.031-0.059l0.236-0.013 7.333-0.013z"/>
</svg>`;

const ZHIPU_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M3.553 0A3.552 3.552 0 000 3.553v16.894A3.552 3.552 0 003.553 24h16.894a3.552 3.552 0 003.562-3.544V3.553A3.552 3.552 0 0020.456 0zM3.994 4.828c-.01.009 8.433.009 8.433.009L11.247 6.514c-.181.263-.49.427-.816.427H3.994zm9.692.009h6.747L10.314 19.172H3.567zm-.108 12.223h6.428v2.113H11.573l1.188-1.686c.182-.263.49-.427.817-.427z"/>
</svg>`;

const KIMI_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M21.803 0c-1.229 0-2.223 1.034-2.223 2.309v2.034c0 .15.117.272.262.272h1.961A2.225 2.307 0 0021.803 0zM.215 4.308A.216.216 0 000 4.584v19.139c0 .154.095.277.215.277h3.113c.12 0 .215-.123.215-.277v-3.9c0-.082.028-.161.079-.213l2.804-2.887a.183.19 0 01.237-.028l7.502 5.728A8.882 9.212 0 0018.16 22.9c.125.015.23-.114.23-.276v-3.673c0-.14-.081-.254-.19-.272a5.817 6.034 0 01-2.076-1.145L9.364 13.896c-.136-.094-.154-.335-.034-.457l8.396-8.641c.158-.163.068-.49-.136-.49h-4.517a.19.197 0 00-.135.061L3.891 13.676c-.141.144-.35.015-.35-.216V4.584c0-.152-.095-.277-.213-.276z"/>
</svg>`;

const MINIMAX_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path fill-rule="nonzero" d="M16.278 2c1.156 0 2.093.927 2.093 2.07v12.501c0 .391.333.709.744.709s.743-.318.743-.709V9.099a2.06 2.06 0 012.071-2.049 2.06 2.06 0 012.071 2.05v6.561c0 .356-.292.645-.652.645s-.653-.289-.653-.645v-6.56a.762.762 0 00-.766-.758.762.762 0 00-.766.758v7.471a2.037 2.037 0 01-2.048 2.026 2.037 2.037 0 01-2.048-2.026V4.072a.785.785 0 00-.788-.753.785.785 0 00-.789.752L15.49 19.975a2.037 2.037 0 01-2.048 2.025 2.037 2.037 0 01-2.048-2.026v-1.934c0-.356.292-.645.652-.645s.652.289.652.645v1.934c0 .263.142.506.372.638s.514.131.744 0a.734.734 0 00.372-.638V4.07c0-1.143.937-2.07 2.093-2.07zm-5.674 0c1.156 0 2.093.927 2.093 2.07v11.523c0 .356-.292.645-.652.645s-.652-.289-.652-.645V4.07a.785.785 0 00-.789-.78.785.785 0 00-.789.78v14.013a2.06 2.06 0 01-2.07 2.048 2.06 2.06 0 01-2.071-2.048V9.099a.762.762 0 00-.766-.758.762.762 0 00-.766.758v3.8a2.06 2.06 0 01-2.071 2.049 2.06 2.06 0 01-2.071-2.049v-1.378c0-.357.292-.646.652-.646s.653.29.653.646v1.378c0 .418.343.757.766.757s.766-.339.766-.757V9.098a2.06 2.06 0 012.07-2.048 2.06 2.06 0 012.071 2.048v8.984c0 .419.343.758.767.758s.766-.339.766-.758V4.07c0-1.143.937-2.07 2.093-2.07z"/>
</svg>`;

const GOOGLE_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.314 17.378C.48 15.764 0 13.942 0 12S.48 8.236 1.314 6.622C3.328 2.695 7.458 0 12.245 0c3.306 0 6.067 1.189 8.193 3.13l-3.507 3.437c-1.28-1.178-2.883-1.789-4.686-1.789-3.184 0-5.889 2.105-6.857 4.942-.245.72-.39 1.483-.39 2.28 0 .796.145 1.56.39 2.28l-.015.011h.015c.968 2.836 3.673 4.942 6.857 4.942 1.647 0 3.039-.436 4.13-1.156 1.302-.851 2.17-2.117 2.46-3.611H12.245V9.818h11.532c.145.786.223 1.604.223 2.455 0 3.654-1.336 6.73-3.652 8.825C18.323 22.931 15.551 24 12.245 24c-4.787 0-8.917-2.695-10.931-6.622z"/>
</svg>`;




const {
    Plugin,
    setIcon,
    Modal,
    PluginSettingTab,
    Setting,
    MarkdownRenderer,
    requestUrl,
    setTooltip,
    MarkdownView,
    Platform,
} = require('obsidian');

// 默认设置
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
    toClose: false,
    toThink: true,
    clearInputTime: 1, 
    selectSearch: true,
    searchPrompt:'',
};

// 主插件类
class AISearchPlugin extends Plugin {
    async onload() {
        await this.loadSettings();

        // --- 新增：初始化历史文件 ---
        this.historyPath = `${this.manifest.dir}/history.md`;
        const adapter = this.app.vault.adapter;
        if (!(await adapter.exists(this.historyPath))) {
            await adapter.write(this.historyPath, ""); // 如果不存在则创建空文件
        }

        this.lastTriggerTime = 0;
        this.currentModal = null;
        this.registerDomEvent(document, 'keydown', this._onTriggerKey.bind(this));
        this.addSettingTab(new AISearchSettingTab(this.app, this));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    _onTriggerKey(evt) {
        if (evt.key !== this.settings.triggerKey) return;

        if (this.currentModal) {
            this.currentModal.close();
            this.currentModal = null;
            this.lastTriggerTime = 0;
            return;
        }

        const now = Date.now();
        const diff = now - this.lastTriggerTime;
        if (diff > 0 && diff < 300) {
            const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
            const editor = activeView?.editor ?? null;
            // 获取选中的文本（可能为空）
            const selectedText = editor ? editor.getSelection() : '';
            const modal = new AISearchModal(this.app, this, editor, selectedText);
            modal.open();
            this.currentModal = modal;
            this.lastTriggerTime = 0;
        } else {
            this.lastTriggerTime = now;
        }
    }
}

// 设置面板 (使用辅助函数消除重复)
class AISearchSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();
        this.containerEl = containerEl;

        containerEl.createEl('h2', { text: '快捷键设置' });

        new Setting(containerEl)
            .setName('触发按键')
            .addDropdown(d => {
                d.addOption('Alt', 'Alt')
                .addOption('Control', 'Ctrl')
                .setValue(this.plugin.settings.triggerKey)
                .onChange(async v => {
                    this.plugin.settings.triggerKey = v;
                    await this.plugin.saveSettings();
                });
                // 将下拉框变成腰圆形状
                d.selectEl.style.borderRadius = '24px';
                d.selectEl.style.paddingLeft = '30px';
                d.selectEl.style.paddingRight = '30px';
            });

        this._addKeyBinding('模拟Up键', 'upKey');
        this._addKeyBinding('模拟Down键', 'downKey');
        this._addKeyBinding('模拟Left键', 'leftKey');
        this._addKeyBinding('模拟Right键', 'rightKey');
        this._addKeyBinding('发送按键', 'sendKey');
        this._addToggle('发送后自动关闭', '发送操作后是否立即关闭搜索窗口', 'toClose');
        this._addSlider('清空输入框时间', '长按空格键清空输入框的时间阈值', 'clearInputTime', [0, 3, 0.1]);

        containerEl.createEl('h2', { text: '弹窗大小设置' });
        this._addSlider('窗口宽度', '', 'modalWidth', [300, 1200, 10]);
        this._addSlider('窗口高度', '', 'modalHeight', [200, 800, 10]);

        containerEl.createEl('h2', { text: 'API设置' });
        this._addText('服务器地址', '', 'apiUrl');
        this._addText('API Key', '', 'apiKey', 'sk-...');
        this._addText('模型类型', '', 'apiModel');
        this._addSlider('输出长度上限', '数值越小越节约token数', 'apiMaxToken', [100, 5000, 100]);
        this._addSlider('采样温度', '数值越小越精准，数值越大越有创意', 'apiTemperature', [0, 2, 0.1]);
        this._addToggle('启用思考模式', '关闭可让简单问题回答更快，不输出思维链', 'toThink');

        // --- 单独创建“选中搜索”开关，并在切换时控制 searchPrompt 的可见性 ---
        new Setting(containerEl)
            .setName('选中搜索')
            .setDesc('模拟搜索引擎选中文本进行搜索')
            .addToggle(t => {
                t.setValue(this.plugin.settings.selectSearch)
                .onChange(async v => {
                    this.plugin.settings.selectSearch = v;
                    await this.plugin.saveSettings();
                     // 同步可见性：开启时显示，关闭时隐藏
                    searchPromptItem.style.display = v ? '' : 'none';
                });
            });

        // --- 先创建“搜索提示词”输入框，以便后续控制其显示/隐藏 ---
        const searchPromptSetting = this._addTextArea(
            '搜索提示词', '自定义搜索时的提示语', 
            'searchPrompt', 
            '例如填写「搜索{{selection}}的相关信息」然后你选中「蔡徐坤」并直接启动插件，' +
            '就会变成向询问「搜索蔡徐坤的相关信息」，用于模拟一般的搜索引擎搜索');

        // 单独设置 textarea 的高度和样式
        const textareaEl = searchPromptSetting.controlEl.querySelector('textarea');
        if (textareaEl) {
            textareaEl.style.height = '80px';
            textareaEl.style.width = '300px';
            textareaEl.style.resize = 'vertical';
            textareaEl.style.boxSizing = 'border-box';
        }

        // 获取“搜索提示词”所在行的整个容器元素（.setting-item）
        const searchPromptItem = searchPromptSetting.settingEl;
        // 根据当前 selectSearch 的值，初始化显示或隐藏
        searchPromptItem.style.display = this.plugin.settings.selectSearch ? '' : 'none';

        containerEl.createEl('h2', { text: '其它设置' });

        // 教程链接按钮
        const tutorialSetting = new Setting(containerEl)
            .setName('插件教程')
            .setDesc('打开B站查看本插件的使用教程')
            .addButton(button => {
                // 设置按钮文字和行为
                button.setButtonText('打开B站')
                    .setCta()
                    .onClick(() => {
                        if (Platform.isDesktop) {
                            require('electron').shell.openExternal('https://www.bilibili.com/video/BV1xd5J6qEBa');
                        } else {
                            window.open('https://www.bilibili.com/video/BV1xd5J6qEBa');
                        }
                    });
                // 直接在按钮元素上设置腰圆样式
                button.buttonEl.style.borderRadius = '24px';
                button.buttonEl.style.paddingLeft = '20px';
                button.buttonEl.style.paddingRight = '20px';
            });
        }

        // 按键设置显示函数
        _codeToDisplay(code) {
            if (code.startsWith('Key')) {
                // 字母键：KeyI → I
                return code.slice(3);
            }
            if (code.startsWith('Digit')) {
                // 数字键：Digit1 → 1
                return code.slice(5);
            }
            const map = {
                'Space': 'Space',
                'ArrowUp': '↑',
                'ArrowDown': '↓',
                'ArrowLeft': '←',
                'ArrowRight': '→',
                'Enter': 'Enter',
                'Escape': 'Esc',
                'Tab': 'Tab',
                'Backspace': '⌫',
                'Delete': 'Del',
                // 可按需添加其他键
            };
            return map[code] || code;  // 未映射的直接显示原 code
        }

        _addKeyBinding(name, key) {
            new Setting(this.containerEl)
                .setName(name)
                .addText(t => {
                    const inp = t.inputEl;
                    // 显示转换后的可读文本
                    inp.value = this._codeToDisplay(this.plugin.settings[key]);
                    Object.assign(inp.style, {
                        cursor: 'pointer',
                        textAlign: 'center',
                        width: '100px',
                        borderRadius: '24px',
                        paddingLeft: '8px',
                        paddingRight: '8px'
                    });
                    inp.addEventListener('keydown', async e => {
                        e.preventDefault();
                        const code = e.code;                    // 保存原始 code
                        this.plugin.settings[key] = code;
                        t.setValue(this._codeToDisplay(code)); // 显示转换后的文本
                        await this.plugin.saveSettings();
                        inp.blur();
                    });
                });
        }

        _addToggle(name, desc, key) {
            new Setting(this.containerEl)
                .setName(name)
                .setDesc(desc)
                .addToggle(t => t
                    .setValue(this.plugin.settings[key])
                    .onChange(async v => {
                        this.plugin.settings[key] = v;
                        await this.plugin.saveSettings();
                    }));
        }

        _addSlider(name, desc, key, limits) {
            new Setting(this.containerEl)
                .setName(name)
                .setDesc(desc)
                .addSlider(s => s
                    .setLimits(...limits)
                    .setValue(this.plugin.settings[key])
                    .setDynamicTooltip()
                    .onChange(async v => {
                        this.plugin.settings[key] = v;
                        await this.plugin.saveSettings();
                    }));
        }

        _addText(name, desc, key, placeholder = '') {
            const setting = new Setting(this.containerEl)
                .setName(name)
                .setDesc(desc)
                .addText(t => t
                    .setPlaceholder(placeholder)
                    .setValue(this.plugin.settings[key])
                    .onChange(async v => {
                        this.plugin.settings[key] = v;
                        await this.plugin.saveSettings();
                    }));
            return setting;   // 返回 Setting 对象，便于外部进一步定制
        }

        _addTextArea(name, desc, key, placeholder = '') {
            const setting = new Setting(this.containerEl)
                .setName(name)
                .setDesc(desc)
                .addTextArea(t => t
                    .setPlaceholder(placeholder)
                    .setValue(this.plugin.settings[key])
                    .onChange(async v => {
                        this.plugin.settings[key] = v;
                        await this.plugin.saveSettings();
                    }));
            return setting;
        }
}

// 搜索弹窗
class AISearchModal extends Modal {
    constructor(app, plugin, editor, selectedText = '') {
        super(app);
        this.plugin = plugin;
        this.editor = editor;
        this.selectedText = selectedText;
        this.cursorPos = editor?.getCursor() ?? null;
        this.virtualCaret = null;
        this.savedRange = null;
        this._globalKeyHandler = null;
        this._resultKeyHandler = null;
        this._lastSendTime = 0;
        this._spaceTimer = null;
        this._wasLongPress = false;
        this.isComposing = false; 
    }

    onOpen() {
        this._setupStyle();
        this._render();
        this._bindEvents();
        
        // 如果开启了“选中搜索”，且确实有选中文本，则自动填入并搜索
        if (this.plugin.settings.selectSearch && this.selectedText) {
            this.inputEl.value = this.selectedText;
            this.inputEl.style.height = 'auto';
            // 标记这是一次自动搜索，后续手动搜索将不拼接 searchPrompt
            this._isAutoSearch = true;
            setTimeout(() => this._search(), 20);
        } else {
            this._isAutoSearch = false;
            this._displayHistory(); 
            setTimeout(() => this.inputEl?.focus(), 50);
        }
    }

    _setupStyle() {
        const { modalEl, contentEl } = this;
        modalEl.style.width = `${this.plugin.settings.modalWidth}px`;
        modalEl.style.height = `${this.plugin.settings.modalHeight}px`;
        modalEl.querySelector('.modal-close-button')?.remove();
        modalEl.parentElement.addClass('aisearch-overlay');
        modalEl.addClass('aisearch-modal');
        contentEl.addClass('aisearch-content');
    }

    _render() {
        const { contentEl } = this;
        const inputContainer = contentEl.createDiv({ cls: 'aisearch-input-container' });
        const inputWrapper = inputContainer.createDiv({ cls: 'aisearch-input-wrapper' });

        this.inputEl = inputWrapper.createEl('textarea', {
            cls: 'aisearch-input',
            //输入框提示信息
            attr: { placeholder: '', rows: '1' }
        });

        // 添加 SVG 占位图标（绝对定位，盖在输入框上）
        this.svgPlaceholder = inputWrapper.createSpan({ cls: 'aisearch-svg-placeholder' });

        // 根据 apiModel 字符串的值切换 icon
        const model = (this.plugin.settings.apiModel || '').toLowerCase();
        if (model.includes('deepseek')) {
            this.svgPlaceholder.innerHTML = DEEPSEEK_SVG;
        } else if (model.includes('hy') || model.includes('hunyuan')) {
            this.svgPlaceholder.innerHTML = HUNYUAN_SVG;
        } else if (model.includes('qwen')) {
            this.svgPlaceholder.innerHTML = QWEN_SVG;
        } else if (model.includes('glm')) {
            this.svgPlaceholder.innerHTML = ZHIPU_SVG;
        } else if (model.includes('kimi')) {
            this.svgPlaceholder.innerHTML = KIMI_SVG;
        } else if (model.includes('minimax')) {
            this.svgPlaceholder.innerHTML = MINIMAX_SVG;
        } else {
            setIcon(this.svgPlaceholder, 'search');
        }

        const thinkBtn = inputWrapper.createDiv({ cls: 'aisearch-think-btn' });

        // 根据当前 toThink 状态更新按钮外观和提示
        const updateThinkBtn = () => {
            if (this.plugin.settings.toThink) {
                thinkBtn.classList.add('aisearch-think-on');
                thinkBtn.classList.remove('aisearch-think-off');
                setTooltip(thinkBtn, '思考模式：开', { placement: 'top' });
            } else {
                thinkBtn.classList.remove('aisearch-think-on');
                thinkBtn.classList.add('aisearch-think-off');
                setTooltip(thinkBtn, '思考模式：关', { placement: 'top' });
            }
        };
        updateThinkBtn();

        // 点击切换状态并保存
        thinkBtn.addEventListener('click', async () => {
            this.plugin.settings.toThink = !this.plugin.settings.toThink;
            await this.plugin.saveSettings();
            updateThinkBtn();
        });

        this.resultArea = contentEl.createDiv({
            cls: 'aisearch-result-area',
            attr: { tabindex: '0', contenteditable: 'false' }
        });
        this.virtualCaret = this.resultArea.createDiv({ cls: 'aisearch-caret' });
    }

    _bindEvents() {
        // 1. 处理中文输入法状态，确保输入法开启时不触发清空逻辑
        this.inputEl.addEventListener('compositionstart', () => { this.isComposing = true; });
        this.inputEl.addEventListener('compositionend', () => { this.isComposing = false; });

        // 控制 SVG 图标显示的函数：内容为空且输入框聚焦时才显示
        const updateSvgPlaceholder = () => {
            if (this.svgPlaceholder) {
                const show = this.inputEl.value === '' 
                    && this.inputEl.placeholder === ''  // 无 placeholder 时才显示图标
                    && document.activeElement === this.inputEl;
                this.svgPlaceholder.style.display = show ? 'flex' : 'none';
            }
        };

        this.inputEl.addEventListener('input', () => {
            // 控制高度
            if (this.inputEl.value === '') {
                this.inputEl.style.height = '';
                this._displayHistory();
            } else {
                this.inputEl.style.height = 'auto';
                this.inputEl.style.height = `${this.inputEl.scrollHeight}px`;
            }
            updateSvgPlaceholder();
        });

        this.inputEl.addEventListener('focus', updateSvgPlaceholder);
        this.inputEl.addEventListener('blur', updateSvgPlaceholder);

        this.inputEl.addEventListener('keydown', e => {
            // --- 长按空格清空逻辑 ---
            if (e.key === ' ' && !this.isComposing && this.plugin.settings.clearInputTime > 0) {
                if (!e.repeat) {
                    // 第一次按下时开始计时
                    this._wasLongPress = false;
                    this._spaceTimer = setTimeout(() => {
                        this.inputEl.value = '';
                        this.inputEl.style.height = 'auto';
                        this._wasLongPress = true;
                        // 可选：添加一个微弱的视觉反馈
                        this.inputEl.classList.add('aisearch-input-cleared');
                        setTimeout(() => this.inputEl.classList.remove('aisearch-input-cleared'), 500);
                    }, this.plugin.settings.clearInputTime * 1000);
                } else if (this._wasLongPress) {
                    // 如果已经触发了清空，阻止后续自动重复产生的空格字符
                    e.preventDefault();
                }
            }

            // --- 原有 Enter 逻辑 ---
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this._search();
            }
        });

        this.inputEl.addEventListener('keyup', e => {
            if (e.key === ' ') {
                clearTimeout(this._spaceTimer);
                // 如果是长按后的释放，阻止默认行为防止在清空后的输入框留下一个空格
                if (this._wasLongPress) {
                    e.preventDefault();
                    this._wasLongPress = false;
                }
            }
        });

        this._globalKeyHandler = e => {
            if (e.key === this.plugin.settings.triggerKey) {
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
                    const sel = window.getSelection();
                    if (this.savedRange) {
                        sel.removeAllRanges();
                        sel.addRange(this.savedRange);
                    } else {
                        this._initSelection();
                    }
                    this._updateCaret();
                } else {
                    this.inputEl.focus();
                }
            }
        };
        this.modalEl.addEventListener('keydown', this._globalKeyHandler, true);

        this.resultArea.addEventListener('blur', () => this._hideCaretAndSave());

        this._resultKeyHandler = e => {
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
                    this._initSelection();
                }

                // --- 关键修改开始：记录移动前的位置 ---
                const rangeBefore = sel.getRangeAt(0).cloneRange();
                const startContainerBefore = rangeBefore.startContainer;
                const startOffsetBefore = rangeBefore.startOffset;
                // --- 关键修改结束 ---

                const [dir, gran] = dirMap[e.code];
                sel.modify(e.shiftKey ? 'extend' : 'move', dir, gran);

                // --- 关键修改开始：检查是否真的移动了 ---
                // 如果移动后的位置和移动前一样，说明到达边界了，直接返回
                if (sel.rangeCount > 0) {
                    const rangeAfter = sel.getRangeAt(0);
                    if (
                        rangeAfter.startContainer === startContainerBefore &&
                        rangeAfter.startOffset === startOffsetBefore
                    ) {
                    // 位置没变，说明到头了，不需要更新视图
                    return;
                    }
                }
                // --- 关键修改结束 ---

                // 原有的边界检查逻辑（保持不变）
                if (sel.rangeCount > 0 && !this.resultArea.contains(sel.focusNode)) {
                    sel.removeAllRanges();
                    sel.addRange(rangeBefore);
                    return;
                }

                // 只有在真正移动时才更新视图
                setTimeout(() => {
                    this._ensureVisible();
                    this._updateCaret();
                }, 0);
                return;
            }
            if (e.code === settings.sendKey) {
                e.preventDefault();

                // 2秒冷却：忽略连续快速触发
                const now = Date.now();
                if (now - this._lastSendTime < 2000) return;
                this._lastSendTime = now;

                // 如果插件是通过选中文本启动的，禁用 sendKey 功能
                if (this.selectedText) return;

                // 获取选区文本，如果无选区则取结果区全部内容
                const rawText = window.getSelection().toString();
                if (!rawText.trim()) return; // 无选区直接返回，不执行任何操作
                
                const selectedText = rawText.replace(/^\n+|\n+$/g, '');
                
                if (selectedText && this.editor) {
                    const cursor = this.editor.getCursor();
                    this.editor.replaceRange(selectedText, cursor);
                    this.editor.setCursor({
                        line: cursor.line,
                        ch: cursor.ch + selectedText.length
                    });

                    if (this.plugin.settings.toClose) {
                        this.close();
                    } else {
                        this.resultArea.classList.add('send-flash');
                        setTimeout(() => {
                            this.resultArea.classList.remove('send-flash');
                        }, 1500);
                    }
                }
                return;
            }
        };
        this.resultArea.addEventListener('keydown', this._resultKeyHandler, true);
        this.resultArea.addEventListener('scroll', () => this._updateCaret());
        this.resultArea.addEventListener('mousedown', () => {
            setTimeout(() => {
                this._updateCaret();
                requestAnimationFrame(() => this._ensureVisible());
            }, 10);
        });
    }

    _hideCaretAndSave() {
        this.virtualCaret.style.display = 'none';
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0).cloneRange();
            this.savedRange = this.resultArea.contains(range.commonAncestorContainer) ? range : null;
        } else {
            this.savedRange = null;
        }
    }

    _initSelection() {
        const range = document.createRange();
        range.selectNodeContents(this.resultArea);
        range.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    _updateCaret() {
        const sel = window.getSelection();
        if (!sel.rangeCount || !this.resultArea.contains(sel.focusNode)) {
            this.virtualCaret.style.display = 'none';
            return;
        }

        const range = document.createRange();
        try {
            // 始终追踪 focusNode（选区的活动端）
            range.setStart(sel.focusNode, sel.focusOffset);
            range.collapse(true);
        } catch (e) { return; }

        let rect = range.getBoundingClientRect();
        const containerRect = this.resultArea.getBoundingClientRect();

        // 如果位置不可读（如在行尾），用零宽字符撑开计算
        if (rect.width === 0 && rect.height === 0) {
            const span = document.createElement('span');
            span.innerHTML = '&#8203;';
            range.insertNode(span);
            rect = span.getBoundingClientRect();
            span.remove();
        }

        Object.assign(this.virtualCaret.style, {
            display: 'block',
            left: `${rect.left - containerRect.left + this.resultArea.scrollLeft}px`,
            top: `${rect.top - containerRect.top + this.resultArea.scrollTop}px`,
            height: `${rect.height || 20}px`,
        });
    }

    _ensureVisible() {
            const sel = window.getSelection();
            // 确保选区存在且焦点在结果区域内
            if (!sel.rangeCount || !this.resultArea.contains(sel.focusNode)) return;

            const range = document.createRange();
            try {
                // 1. 在当前的焦点（即 Shift + K 移动到的位置）创建一个临时的 Range
                range.setStart(sel.focusNode, sel.focusOffset);
                range.collapse(true);

                // 2. 插入一个不可见的探测元素
                const ghost = document.createElement('span');
                // 设置一个高度缓冲区，比如 30px（约1.5行高），这样它会提前触发滚动
                ghost.style.cssText = 'display:inline-block;width:1px;height:30px;vertical-align:bottom;';
                range.insertNode(ghost);

                // 3. 调用原生滚动 API
                // block: 'nearest' 表示“就近滚动”：如果已经在视野内就不动，如果超出边界就滚到最近的边边缘
                ghost.scrollIntoView({ behavior: 'auto', block: 'nearest' });

                // 4. 立即移除探测元素，防止破坏文档结构
                ghost.remove();
                
                // 5. 滚动后立即同步更新虚拟光标的位置
                this._updateCaret();
            } catch (e) {
                // 忽略 range 设置时可能的微小错误
            }
        }

    async _search() {
        let query = this.inputEl.value.trim();

        // 保存是否是自动搜索的标志（在拼接前记录）
        const isAuto = this._isAutoSearch && this.plugin.settings.selectSearch && this.selectedText;

        if (isAuto) {
            const template = this.plugin.settings.searchPrompt || '';
            if (template.includes('{{selection}}')) {
                query = template.replace(/\{\{selection\}\}/g, this.selectedText);
            } else {
                query = this.selectedText + template;
            }
            this._isAutoSearch = false;
        }

        if (query) {
            this.inputEl.placeholder = isAuto ? this.selectedText : query;
            this.inputEl.value = '';
            this.inputEl.style.height = '';
        }

        if (!query) return;

        const { apiKey, apiModel } = this.plugin.settings;
        if (!apiKey) {
            this.resultArea.empty();
            this.virtualCaret = this.resultArea.createDiv({ cls: 'aisearch-caret' });
            this.resultArea.createDiv({
                text: '❌ 请先在插件设置中填写 API Key',
                attr: { style: 'color: var(--text-error);' }
            });
            return;
        }

        this.resultArea.empty();
        this.virtualCaret = this.resultArea.createDiv({ cls: 'aisearch-caret' });
        const statusEl = this.resultArea.createDiv({ cls: 'aisearch-status', text: `🚀 ${apiModel} 思考中...` });
        const responseEl = this.resultArea.createDiv({ cls: 'aisearch-response' });

        try {
            const answer = await this._fetchAI(query);
            await this._writeHistory(answer);
            statusEl.remove();
            await MarkdownRenderer.renderMarkdown(answer, responseEl, '', this.plugin);
            this.savedRange = null;
            this.resultArea.focus();
            this._initSelection();
            this._updateCaret();
        } catch (error) {
            statusEl.setText(`❌ 错误: ${this._friendlyError(error.message)}`);
        }
    }

    async _fetchAI(query) {
        const { apiUrl, apiKey, apiModel, apiMaxToken, apiTemperature, toThink } = this.plugin.settings;

        const body = {
            model: apiModel,
            messages: [
                { role: 'system', content: '你是一个集成在 Obsidian 中的 AI 助手。' },
                { role: 'user', content: query }
            ],
            max_tokens: apiMaxToken,
            temperature: apiTemperature,
            stream: false
        };

        // 2. 根据设置决定是否启用思考模式
        body.thinking = { type: toThink ? 'enabled' : 'disabled' };

        const response = await requestUrl({
            url: apiUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify(body)
        });
        
        const result = response.json;
        if (result.error) throw new Error(result.error.message);
        
        return result.choices[0].message.content;
    }

    _friendlyError(msg) {
        if (msg.includes('401')) return 'API Key 错误';
        if (msg.includes('402')) return '余额不足';
        if (msg.includes('429')) return '频率过快';
        return msg;
    }

    // --- 新增：历史文件处理辅助函数 ---
    async _readHistory() {
        try {
            return await this.app.vault.adapter.read(this.plugin.historyPath);
        } catch (e) {
            return "";
        }
    }

    async _writeHistory(content) {
        try {
            await this.app.vault.adapter.write(this.plugin.historyPath, content);
        } catch (e) {
            console.error("写入历史文件失败", e);
        }
    }

    async _displayHistory() {
        const content = await this._readHistory();
        this.resultArea.empty();
        this.virtualCaret = this.resultArea.createDiv({ cls: 'aisearch-caret' });
        const responseEl = this.resultArea.createDiv({ cls: 'aisearch-response' });
        
        if (content.trim()) {
            await MarkdownRenderer.renderMarkdown(content, responseEl, '', this.plugin);
        } 
    }

    onClose() {
        if (this._globalKeyHandler) this.modalEl.removeEventListener('keydown', this._globalKeyHandler, true);
        if (this._resultKeyHandler) this.resultArea.removeEventListener('keydown', this._resultKeyHandler, true);
        this.plugin.currentModal = null;
        this.contentEl.empty();
    }
}

module.exports = AISearchPlugin;
