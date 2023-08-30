class MessageComponent {
    constructor() {
        this.messageBox = null;
    }
    // 遮罩层
    getMask() {
        const maskDiv = document.createElement('div');
        const styles = {
            position: 'fixed',
            left: '0px',
            top: '0px',
            right: '0px',
            bottom: '0px',
            backgroundColor: 'rgba(0,0,0,0.4)',
        };
        for(const attr in styles) {
            maskDiv.style[attr] = styles[attr];
        }

        return maskDiv;
    }
    // 提示内容
    getContent({ message }) {
        const contentDiv = document.createElement('div');
        const styles = {
            width: '100%',
            padding: '16px 12px',
            backgroundColor: '#2f3133',
            color: '#fff',
            position: 'absolute',
            bottom: 0
        };
        for(const attr in styles) {
            contentDiv.style[attr] = styles[attr];
        }
        contentDiv.innerHTML = `<span>${message}</span>
            <div class="btn" style="background-color:#FF2436;text-align: center;width: 46px;border-radius: 2px;line-height: 28px;position: relative;right: 0px;margin: 12px 0 0 auto;cursor: pointer;">OK</div>
        `;

        return contentDiv;
    }

    createDom({ message }) {
        const maskDiv = this.getMask();
        const contentDiv = this.getContent({ message });

        const messageDiv = document.createElement('div');
        messageDiv.appendChild(maskDiv);
        messageDiv.appendChild(contentDiv);
        // 添加点击事件
        const _this = this;
        messageDiv.addEventListener('click', e => {
            if(e.target.className.indexOf('btn') > -1) {
                _this.hide();
            }
        });

        this.messageBox = messageDiv;
        document.body.appendChild(this.messageBox);
    }

    show({ message }) {
        this.createDom({ message });
    }

    hide() {
        if(this.messageBox) {
            this.messageBox.removeEventListener('click', e => {});
            document.body.removeChild(this.messageBox);
            this.messageBox = null;
        }
    }
}


window.messageCom = new MessageComponent();