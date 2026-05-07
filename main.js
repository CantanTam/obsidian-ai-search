"use strict";

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
    clearInputTime: 1, 
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
            const modal = new AISearchModal(this.app, this, editor);
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
        new Setting(this.containerEl)
            .setName(name)
            .setDesc(desc)
            .addText(t => t
                .setPlaceholder(placeholder)
                .setValue(this.plugin.settings[key])
                .onChange(async v => {
                    this.plugin.settings[key] = v;
                    await this.plugin.saveSettings();
                }));
    }
}

// 搜索弹窗
class AISearchModal extends Modal {
    constructor(app, plugin, editor) {
        super(app);
        this.plugin = plugin;
        this.editor = editor;
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
        setTimeout(() => this.inputEl?.focus(), 50);
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
            attr: { placeholder: 'Shift + Enter 换行', rows: '1' }
        });

        const clearBtn = inputWrapper.createDiv({ cls: 'aisearch-clear-btn clickable-icon' });
        setIcon(clearBtn, 'cross');
        setTooltip(clearBtn, '清空输入', { placement: 'top' });

        this.resultArea = contentEl.createDiv({
            cls: 'aisearch-result-area',
            attr: { tabindex: '0', contenteditable: 'false' }
        });
        this.virtualCaret = this.resultArea.createDiv({ cls: 'aisearch-caret' });
        this.resultArea.createDiv({
            text: '等待输入...',
            attr: { style: 'color: var(--text-muted); opacity: 0.5;' }
        });

        clearBtn.addEventListener('click', () => {
            this.inputEl.value = '';
            this.inputEl.style.height = 'auto';
            this.inputEl.focus();
        });
    }

    _bindEvents() {
        // 1. 处理中文输入法状态，确保输入法开启时不触发清空逻辑
        this.inputEl.addEventListener('compositionstart', () => { this.isComposing = true; });
        this.inputEl.addEventListener('compositionend', () => { this.isComposing = false; });

        this.inputEl.addEventListener('input', () => {
            this.inputEl.style.height = 'auto';
            this.inputEl.style.height = `${this.inputEl.scrollHeight}px`;
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
                    // 恢复旧range的逻辑...
                    if (prevRange) {
                        sel.removeAllRanges();
                        sel.addRange(prevRange);
                        }
                    return; // 注意这里也需要 return，防止执行下面的 update
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

                // 获取选区文本，并去除首尾多余的换行符
                const rawText = window.getSelection().toString();
                const selectedText = rawText.replace(/^\n+|\n+$/g, '');   // 关键修改
                
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
        const query = this.inputEl.value.trim();

        if (query) {
            this.inputEl.placeholder = query;
            this.inputEl.value = '';
            this.inputEl.style.height = 'auto';
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
        const { apiUrl, apiKey, apiModel, apiMaxToken, apiTemperature } = this.plugin.settings;
        const response = await requestUrl({
            url: apiUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
                model: apiModel,
                messages: [
                    { role: 'system', content: '你是一个集成在 Obsidian 中的 AI 助手。' },
                    { role: 'user', content: query }
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