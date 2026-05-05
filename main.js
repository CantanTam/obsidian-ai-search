"use strict";

const { Plugin, Modal } = require('obsidian');

module.exports = class DeepSeekIt extends Plugin {
    async onload() {
        this.lastAltTime = 0;
        this.registerDomEvent(document, 'keydown', (evt) => {
            if (evt.key === 'Alt') {
                const currentTime = Date.now();
                const timeDiff = currentTime - this.lastAltTime;
                if (timeDiff > 0 && timeDiff < 300) {
                    new DeepSeekSearchModal(this.app).open();
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