"use strict";

const { Plugin, Modal, setIcon } = require('obsidian');

module.exports = class AISearchPlugin extends Plugin {
    async onload() {
        this.lastAltTime = 0;
        this.currentModal = null;

        this.registerDomEvent(document, 'keydown', (evt) => {
            if (evt.key === 'Alt') {

                if (this.currentModal) {
                    this.currentModal.close();
                    this.currentModal = null;
                    this.lastAltTime = 0;
                    return;
                }

                const currentTime = Date.now();
                const timeDiff = currentTime - this.lastAltTime;

                if (timeDiff > 0 && timeDiff < 300) {
                    const modal = new AISearchModal(this.app);

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

class AISearchModal extends Modal {
    onOpen() {
        const { contentEl, modalEl } = this;

        // 移除默认关闭按钮
        modalEl.querySelector('.modal-close-button')?.remove();

        modalEl.parentElement.addClass('aisearch-overlay');
        modalEl.addClass('aisearch-modal');
        contentEl.addClass('aisearch-content');

        // 输入区域（带清除按钮）
        const inputContainer = contentEl.createDiv({ cls: 'aisearch-input-container' });

        const inputWrapper = inputContainer.createDiv({ cls: 'aisearch-input-wrapper' });

        const inputEl = inputWrapper.createEl('input', {
            cls: 'aisearch-input',
            attr: {
                placeholder: 'AI 搜索...',
                type: 'text'
            }
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