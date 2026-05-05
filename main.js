"use strict";

const { Plugin, Modal } = require('obsidian');

module.exports = class DeepSeekIt extends Plugin {
    async onload() {
        this.lastAltTime = 0;
        this.currentModal = null;   // ★ 新增：记录当前打开的 Modal

        this.registerDomEvent(document, 'keydown', (evt) => {
            if (evt.key === 'Alt') {
                // ★ 如果已经有一个窗口打开，按 Alt 直接关闭
                if (this.currentModal) {
                    this.currentModal.close();
                    this.currentModal = null;
                    this.lastAltTime = 0;   // 重置双击计时，避免干扰
                    return;
                }

                // 原有双击打开逻辑
                const currentTime = Date.now();
                const timeDiff = currentTime - this.lastAltTime;
                if (timeDiff > 0 && timeDiff < 300) {
                    const modal = new DeepSeekSearchModal(this.app);
                    
                    // ★ 重写 close 方法，以便窗口因任何原因关闭时都能清除引用
                    const originalClose = modal.close.bind(modal);
                    modal.close = () => {
                        originalClose();
                        this.currentModal = null;
                    };
                    
                    this.currentModal = modal;
                    modal.open();
                    this.lastAltTime = 0;
                } else {
                    this.lastAltTime = currentTime;
                }
            }
        });
    }
};

class DeepSeekSearchModal extends Modal {
    onOpen() {
        const { contentEl, modalEl } = this;
        modalEl.querySelector('.modal-close-button')?.remove();

        // 加自定义类名，所有样式都交给 styles.css 控制
        modalEl.parentElement.addClass('deepseek-overlay');
        modalEl.addClass('deepseek-modal');
        contentEl.addClass('deepseek-content');

        // 输入区域
        const inputContainer = contentEl.createDiv({ cls: 'deepseek-input-container' });
        const inputEl = inputContainer.createEl('input', {
            cls: 'deepseek-input',
            attr: { placeholder: 'DeepSeek 搜索...', type: 'text' }
        });
        
        setTimeout(() => inputEl.focus(), 50);

        // 结果区域
        const resultArea = contentEl.createDiv({ cls: 'deepseek-result-area' });
        resultArea.setText('等待输入...');

        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                resultArea.setText(`🔍 正在为您检索: ${inputEl.value}`);
            }
        });
    }

    onClose() {
        this.contentEl.empty();
    }
}