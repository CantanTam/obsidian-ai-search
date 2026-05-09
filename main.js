"use strict";

// google 图标
const DEEPSEEK_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd" d="m 22.924947,5.1664902 c -0.236401,-0.115867 -0.338148,0.104937 -0.476352,0.217022 -0.04733,0.03615 -0.08739,0.08314 -0.127274,0.126506 -0.345537,0.369054 -0.749271,0.611482 -1.276677,0.582534 -0.77096,-0.04337 -1.429418,0.198999 -2.0113,0.788681 -0.123668,-0.727173 -0.534614,-1.161518 -1.160161,-1.439931 -0.327338,-0.144704 -0.658282,-0.289524 -0.887475,-0.604279 -0.160009,-0.22423 -0.203675,-0.473931 -0.283677,-0.719966 -0.05087,-0.1482501 -0.101924,-0.3002782 -0.272858,-0.3256849 -0.185472,-0.028936 -0.258326,0.1265656 -0.330945,0.256965 -0.291001,0.5318969 -0.403738,1.1179769 -0.392748,1.7112619 0.02554,1.335175 0.58921,2.398728 1.709488,3.155035 0.12727,0.08685 0.159945,0.173653 0.120062,0.300274 -0.0764,0.260571 -0.167333,0.5137588 -0.247336,0.7743298 -0.05093,0.166445 -0.127449,0.202606 -0.305592,0.130284 -0.614617,-0.25679 -1.145746,-0.6368338 -1.61495,-1.0962288 -0.796543,-0.770723 -1.516629,-1.620977 -2.415038,-2.286759 a 10.494565,10.494565 0 0 0 -0.64014,-0.437775 c -0.916547,-0.890016 0.120062,-1.620972 0.360074,-1.707711 0.250937,-0.09052 0.08733,-0.401609 -0.723868,-0.398007 -0.811079,0.0034 -1.553086,0.274928 -2.4986431,0.636774 -0.138264,0.05436 -0.283676,0.09413 -0.432867,0.126565 -0.85835,-0.162842 -1.749431,-0.199003 -2.6805719,-0.09413 -1.7531494,0.195281 -3.1533223,1.023906 -4.1826036,2.438611 -1.23656185,1.700804 -1.52761875,3.6327498 -1.17115205,5.6480678 0.37460545,2.12374 1.45842655,3.882209 3.12424965,5.257152 1.7276268,1.425339 3.7171819,2.12374 5.986631,1.989851 1.378424,-0.07953 2.913371,-0.264002 4.644599,-1.729461 0.436474,0.217026 0.894688,0.303941 1.654893,0.369055 0.585604,0.05436 1.149348,-0.02893 1.585817,-0.119298 0.683809,-0.1447 0.636538,-0.777927 0.389146,-0.893618 -2.003915,-0.93339 -1.564016,-0.553521 -1.964032,-0.861068 1.018355,-1.204772 2.553298,-2.456634 3.153378,-6.512616 0.04727,-0.321904 0.0072,-0.52451 0,-0.7850808 -0.0035,-0.15906 0.03267,-0.220628 0.214605,-0.238771 0.501879,-0.05796 0.989222,-0.195277 1.436626,-0.441432 1.298422,-0.709156 1.822221,-1.87416 1.945889,-3.270727 0.01816,-0.213419 -0.0035,-0.434163 -0.229197,-0.546253 z M 11.610027,17.735519 C 9.6677401,16.208845 8.7257849,15.705785 8.3366429,15.72753 c -0.363675,0.02172 -0.298265,0.437825 -0.218262,0.709151 0.0836,0.26778 0.192856,0.452246 0.345536,0.687411 0.10547,0.155634 0.178264,0.387077 -0.105409,0.560906 C 7.7329609,18.072014 6.6454135,17.554714 6.594424,17.529307 5.3287333,16.783991 4.2703189,15.799908 3.5246502,14.454039 2.8045641,13.158631 2.3862333,11.769453 2.3172213,10.285971 2.2990183,9.927846 2.4045523,9.801044 2.7608987,9.736051 3.2300473,9.649141 3.7137882,9.6309982 4.1829925,9.699731 c 1.9821705,0.289524 3.6697334,1.175936 5.0846154,2.579711 0.8074761,0.7995 1.4184871,1.754806 2.0478161,2.688192 0.669213,0.991351 1.389359,1.935731 2.305902,2.709997 0.323737,0.271326 0.581887,0.477597 0.829278,0.629625 -0.745669,0.08313 -1.989615,0.101275 -2.840577,-0.571719 z m 0.939417,-6.057476 c 0.03078,-0.124732 0.143047,-0.216137 0.279002,-0.216137 a 0.28006935,0.28006935 0 0 1 0.09814,0.01803 c 0.04005,0.01455 0.0764,0.03627 0.10553,0.06871 0.05087,0.05076 0.08,0.123079 0.08,0.199003 0,0.159237 -0.127274,0.285803 -0.287279,0.285803 a 0.28054204,0.28054204 0 0 1 -0.27995,-0.238355 0.29602266,0.29602266 0 0 1 0.0045,-0.117052 z m 2.789348,1.590312 c -0.153978,0.05885 -0.307251,0.105052 -0.455381,0.11108 -0.276464,0.01443 -0.578276,-0.09773 -0.741887,-0.235221 -0.254543,-0.21342 -0.436413,-0.332717 -0.512809,-0.705549 -0.03276,-0.159241 -0.01459,-0.405216 0.01451,-0.546313 0.06547,-0.303941 -0.0073,-0.499343 -0.221808,-0.676601 -0.174542,-0.1447 -0.396526,-0.184467 -0.640139,-0.184467 -0.09094,0 -0.174542,-0.03976 -0.236406,-0.07233 -0.101867,-0.05058 -0.185472,-0.177258 -0.105469,-0.332893 0.02554,-0.05058 0.14919,-0.173653 0.178324,-0.195277 0.33088,-0.188189 0.712873,-0.126682 1.065562,0.01443 0.327338,0.13389 0.574734,0.379865 0.93114,0.727174 0.36368,0.419632 0.429146,0.535503 0.636538,0.850254 0.163727,0.245979 0.312806,0.499337 0.414669,0.788685 0.05181,0.15132 0.0043,0.280071 -0.138321,0.370883 -0.05796,0.03692 -0.124612,0.06169 -0.188545,0.08615 z"/>
</svg>`;


const {
    Plugin,
    Modal,
    setIcon,
    PluginSettingTab,
    Setting,
    MarkdownRenderer,
    requestUrl,
    setTooltip,
    MarkdownView,
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
            .addDropdown(d => d
                .addOption('Alt', 'Alt')
                .addOption('Control', 'Ctrl')
                .setValue(this.plugin.settings.triggerKey)
                .onChange(async v => {
                    this.plugin.settings.triggerKey = v;
                    await this.plugin.saveSettings();
                }));

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

    }

    _addKeyBinding(name, key) {
        new Setting(this.containerEl)
            .setName(name)
            .addText(t => {
                const inp = t.inputEl;
                inp.value = this.plugin.settings[key];
                Object.assign(inp.style, { cursor: 'pointer', textAlign: 'center', width: '100px' });
                inp.addEventListener('keydown', async e => {
                    e.preventDefault();
                    const code = e.code;
                    t.setValue(code);
                    this.plugin.settings[key] = code;
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
        this.svgPlaceholder.innerHTML = DEEPSEEK_SVG;

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

        this.inputEl.addEventListener('input', () => {
            // 控制高度
            if (this.inputEl.value === '') {
                this.inputEl.style.height = '';
            } else {
                this.inputEl.style.height = 'auto';
                this.inputEl.style.height = `${this.inputEl.scrollHeight}px`;
            }
            // 控制 SVG 占位图标的可见性：有内容时隐藏，无内容时显示
            if (this.svgPlaceholder) {
                this.svgPlaceholder.style.display = this.inputEl.value === '' ? 'flex' : 'none';
            }
        });

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
            // 清空后显示 SVG 图标
            if (this.svgPlaceholder) {
                this.svgPlaceholder.style.display = 'flex';
            }
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

    onClose() {
        if (this._globalKeyHandler) this.modalEl.removeEventListener('keydown', this._globalKeyHandler, true);
        if (this._resultKeyHandler) this.resultArea.removeEventListener('keydown', this._resultKeyHandler, true);
        this.plugin.currentModal = null;
        this.contentEl.empty();
    }
}

module.exports = AISearchPlugin;