const vscode = acquireVsCodeApi();

/**
 * 功能切换时，高亮切换
 * @param {*} type 
 */
const setSelectedItem = prefix => {
    const controlEles = document.querySelectorAll('.card-item');
    controlEles.forEach(el => {
        if (el.getAttribute('prefix') === prefix) {
            el.className = 'card-item selected';
        } else {
            el.className = 'card-item';
        }
    });
};

/**
 * 获取当前选择功能的data-type
 * @returns 
 */
const getSelectedItem = () => {
    const controlEles = document.querySelectorAll('.card-item');
    let type = 'chat';
    let prefix = '';
    controlEles.forEach(el => {
        if (el.className.indexOf('selected') > -1) {
            type = el.getAttribute('data-type');
            prefix = el.getAttribute('prefix');
        }
    });

    return { type, prefix };
};

/**
 * 添加子节点
 * @param {*} msg 
 * @param {*} role 
 */
const appendChat = function (msg, role) {
    const list = document.querySelector('.chat-container');
    const avatar = {
        'You': window._IMAGE_URLS.youAvatar,
        'HiPilot': window._IMAGE_URLS.gptAvatar,
        'hxGPT': window._IMAGE_URLS.gptAvatar,
        'InstantCoder': window._IMAGE_URLS.gptAvatar,
    };
    const chat = document.createElement('div');
    chat.classList.add('chat');
    const zanEl = `
    <div class="zan">
        <svg t="1691996719070" class="icon point-like pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26470" width="18" height="18">
            <path d="M160 906.666667a64 64 0 0 1-64-64v-384a64 64 0 0 1 64-64h145.024c17.664-36.864 51.690667-101.888 113.834667-219.648 31.296-55.146667 100.970667-74.133333 155.434666-42.154667 54.186667 31.786667 77.44 98.688 55.082667 157.802667l-28.437333 75.093333h213.504c62.826667 0 113.557333 51.562667 113.557333 114.922667 0 6.570667-0.554667 13.141333-1.664 19.626666l-44.373333 259.477334c-14.506667 84.8-87.104 146.88-172.181334 146.88H160zM474.986667 205.738667a16255.445333 16255.445333 0 0 0-94.976 182.122666c-10.453333 20.48-18.24 36.096-23.36 46.762667a371.626667 371.626667 0 0 0-4.650667 10.069333l0.042667 397.973334h357.738666c53.717333 0 99.818667-39.424 109.098667-93.653334l44.373333-259.498666c0.490667-2.922667 0.746667-5.866667 0.746667-8.832 0-28.245333-22.314667-50.922667-49.578667-50.922667h-306.133333l61.226667-161.749333c11.370667-30.037333-0.426667-64-27.605334-79.957334a48.64 48.64 0 0 0-66.922666 17.706667zM288 458.666667h-128v384h128v-384z" p-id="26471"></path>
        </svg>
        <svg t="1691996525157" class="icon ml-8 point-unlike pointer" viewBox="0 0 1024 1024" version="1.1" p-id="24318" width="14" height="14">
            <path d="M300 608.864V88h477.916c25.815 0 41.979 5.525 51.808 14.617 6.238 6.125 9.602 13.574 10.735 20.38l0.438 2.633 92.314 402.165 0.176 0.712c5.816 23.53 1.843 43.53-10.447 59.143-9.517 11.702-32.017 21.182-59.61 21.182H546.349l72.213 130.586c7.856 14.206 15.912 31.605 23.947 53.053 10.618 28.344 20.148 61.09 28.115 98.645 0.036 0.32-0.053 0.518-0.461 1.612-1.324 3.544-4.218 8.523-9.47 15.814C644.654 926.839 623.467 936 594.813 936c-18.135 0-28.537-4.288-37.618-12.874-8.405-7.946-14.718-17.855-25.561-39.254l-5.634-11.118-5.344-5.732c-0.433-0.72-0.918-1.551-1.444-2.474-1.787-3.135-7.986-14.904-10.1-18.652l0.01-0.006c-25.204-43.028-36.934-62.463-52.366-85.841-21.447-32.49-42.12-59.384-64.482-82.682-28.251-29.434-58.872-52.508-92.273-68.503z m-88-24.668a289.824 289.824 0 0 0-29.43-1.476H97.667c-6.617 0-8.667-2.052-8.667-8.768V96.256C89 90.049 91.054 88 97.667 88H212v496.196z m483.57 112.636h167.76c53.193 0 101.27-20.48 128.379-54.272 29.665-37.376 39.382-85.504 27.107-135.168l-91.552-398.848c-2.557-15.36-10.74-44.544-36.826-69.632C863.331 13.312 825.482 0 777.916 0H97.667C42.429 0 1 41.472 1 96.256v477.696c0 55.296 41.429 96.768 96.667 96.768h84.903c121.729 0 184.64 107.008 250.618 219.648 1.535 2.56 12.787 25.6 19.947 33.28C471.037 958.976 504.282 1024 594.811 1024c55.239 0 101.782-20.992 135.027-60.928 17.39-23.552 34.268-52.224 27.108-89.088-7.304-34.634-15.547-64.206-23.833-89.152l-37.543-88z" p-id="24319"></path>
        </svg>
    </div>
    `;
    chat.innerHTML = `<div class="chat-item ${role}">
                        <div class="userinfo">
                            <img class="avatar" src="${avatar[role]}">
                            <span>${role}</span>
                            ${role === 'You' ? '' : zanEl}
                        </div>
                        <div class="chat-content">${marked.parse(msg)}</div>
                    </div>`;
    list.appendChild(chat);

    scrollToBottom();
};


/**
 * 初始化会话窗口的上下文
 * @param {Array} historyList 
 */
const initChatList = historyList => {
    if(!Array.isArray(historyList) || historyList.length === 0) {
        return;
    }
    const getRole = {
        'user': 'You',
        'assistant': 'HiPilot'
    };
    for(const item of historyList) {
        appendChat(item.content, getRole[item.role]);
    }
    hljs.initHighlighting();
};

/**
 * 获取代码块悬浮功能节点
 */
const getCodePreTools = () => {
    return `<div class="tools-container">
    <div class="tools-item copy" title="复制代码">
        <svg t="1691547397783" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" p-id="4330" width="16" height="16"><path d="M363.793067 0h565.891657C981.77219 0 1024 42.22781 1024 94.315276v565.891657c0 52.097219-42.22781 94.315276-94.315276 94.315277H363.793067c-52.097219 0-94.315276-42.22781-94.315277-94.305524V94.305524c0-52.087467 42.22781-94.315276 94.305524-94.315276z m0 80.847238c-7.441067 0-13.47779 6.026971-13.477791 13.468038v565.891657c0 7.441067 6.036724 13.47779 13.477791 13.477791h565.891657c7.441067 0 13.47779-6.036724 13.47779-13.477791V94.315276c0-7.441067-6.036724-13.47779-13.47779-13.47779H363.793067z m309.891657 754.52221a40.423619 40.423619 0 0 1 80.847238 0v94.315276c0 52.087467-42.22781 94.315276-94.325029 94.315276H94.315276C42.22781 1024 0 981.77219 0 929.684724V363.793067c0-52.097219 42.22781-94.315276 94.315276-94.315277h94.315276a40.423619 40.423619 0 0 1 0 80.837486H94.315276c-7.441067 0-13.47779 6.036724-13.47779 13.477791v565.891657c0 7.441067 6.036724 13.47779 13.47779 13.47779h565.891657c7.441067 0 13.47779-6.036724 13.477791-13.47779v-94.315276z" p-id="4331"></path></svg>
    </div>
    <div class="tools-item copy-success" title="复制代码">
        <svg t="1691548862578" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" p-id="11411" width="14" height="14"><path d="M1001.305115 275.874141 431.461709 845.718571c-28.221762 28.221762-73.977875 28.221762-102.20066 0L22.661116 539.116591c-28.222785-28.221762-28.222785-73.979922 0-102.20066 28.221762-28.221762 73.977875-28.221762 102.20066 0l255.500115 255.502162 518.743588-518.743588c28.221762-28.221762 73.977875-28.221762 102.199637 0C1029.5279 201.89422 1029.5279 247.65238 1001.305115 275.874141z" fill="#72c140" p-id="11412"></path></svg>
    </div>
    <div class="tools-item insert" title="添加到当前行">
        <svg t="1691547846758" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" p-id="10291" width="18" height="18"><path d="M810.666667 448v128h128v85.333333h-128v128h-85.333334v-128h-128v-85.333333h128v-128h85.333334z m-469.333334 213.333333v85.333334H85.333333v-85.333334h256z m256-213.333333v85.333333H85.333333v-85.333333h512z m256-213.333333v85.333333H85.333333v-85.333333h768z" p-id="10292"></path></svg>
    </div>
    <div class="tools-item insert" data-type="newfile" title="添加到新文件">
        <svg t="1691982261599" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" p-id="4258" width="16" height="16"><path d="M378.410667 170.666667H981.333333v768H42.666667V85.333333h278.826666L378.453333 170.666667zM896 341.333333V256H435.285333l56.874667 85.333333H896zM128 170.666667v682.666666h768V426.666667H446.506667l-170.666667-256H128z" p-id="4259"></path><path d="M725.333333 597.333333h85.333334v85.333334h-85.333334v85.333333h-85.333333v-85.333333h-85.333333v-85.333334h85.333333v-85.333333h85.333333z" p-id="4260"></path></svg>
    </div>
</div>`;
};


const cs = new ChatStream();
const loadingInstance = new LoadingComponent();
(function () {
    vscode.postMessage({ type: 'print', value: 'webview onload' });

     // 复制代码
    const copyCode = (codeElement) => {
        const code = codeElement.textContent;
        // 1. 创建一个在屏幕外的textarea
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'absolute';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        // 2. 选中textarea中的代码
        textarea.select();

        try {
            // 3. 复制代码
            document.execCommand('copy');
        } catch(e) {
            console.log(e);
        }
        // 移除节点
        document.body.removeChild(textarea);
        sendTA(`${TA_PREFIX}_copy.click`);
        // 展示复制成功icon
        codeElement.parentNode.querySelectorAll('.copy')[0].style.display = 'none';
        codeElement.parentNode.querySelectorAll('.copy-success')[0].style.display = 'flex';
        setTimeout(() => {
            codeElement.parentNode.querySelectorAll('.copy')[0].style.display = 'flex';
            codeElement.parentNode.querySelectorAll('.copy-success')[0].style.display = 'none';
        }, 1500);
    };

    // 插入代码
    const insetCode = (codeElement, type) => {
        const code = codeElement.textContent;
        // 1. 创建一个在屏幕外的textarea
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'absolute';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        // 2. 选中textarea中的代码
        textarea.select();

        try {
            // 3. 获取选中的代码，不直接用code是因为需要textarea格式化
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            // 4. 通知插件写入到指定位置
            vscode.postMessage({
                type: 'insert',
                value: {
                    content: selectedText,
                    lang: codeElement.className.split(' ')[0],
                    insertNewFile: type === 'newfile' 
                },
            });
            sendTA(`${TA_PREFIX}_${type === 'newfile' ? 'insertNewFile' : 'insert'}.click`);
        } catch(e) {
            console.log(e);
        }
        // 5. 移除节点
        document.body.removeChild(textarea);
    };

    // 点赞点踩
    const zan = (e, target, tagName) => {
        const svgEles = target.querySelectorAll('.icon');
        let hasClick = false;
        svgEles.forEach(el => {
            const className = el.className.baseVal;
            if(className.indexOf('activity') > -1) {
                hasClick = true;
            }
        });
        // 不允许重复点击
        if(hasClick) {
            return;
        }

        const svgTarget = tagName === 'svg' ? e.target : e.target.parentNode;
        const svgClassname = svgTarget.className.baseVal;
        svgTarget.className.baseVal += ' activity';
        if(svgClassname.indexOf('point-like') > -1) {
            sendTA(`${TA_PREFIX}_like.click`);
        } else {
            sendTA(`${TA_PREFIX}_unlike.click`);
        }
    };

    // 绑定点击事件
    document.querySelector('.chat-container').addEventListener('click', e => {
        const tagName = e.target.tagName;
        const getTarget = () => {
            if(tagName === 'svg') {
                return e.target.parentNode;
            } else if(tagName === 'path') {
                return e.target.parentNode.parentNode;
            } else {
                return e.target;
            }
        };
        const target = getTarget();
        const className = target.className;

        const strategyMap = {
            // 复制
            'tools-item copy': () => {
                const codeEl = target.parentNode.nextSibling;
                copyCode(codeEl);
            },
            // 插入
            'tools-item insert': () => {
                const codeEl = target.parentNode.nextSibling;
                insetCode(codeEl, target.getAttribute('data-type'));
            },
            // 点赞点踩
            'zan': () => {
                zan(e, target, tagName);
            },
        };

        strategyMap[className] ? strategyMap[className]() : null;
    });

    // 输入框回车事件监听
    const promptEl = document.querySelector('#prompt');
    promptEl?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            postReq(promptEl.value);
            sendTA({ id: `${TA_PREFIX}_inputEnter.click`, message: promptEl.value });
            promptEl.value = '';
        }
    });

    // 功能卡片点击事件
    const controlEles = document.querySelectorAll('.card-item');
    const postReqControl = ['select-scan', 'file-select-scan'];
    controlEles.forEach(el => {
        el.addEventListener('click', function () {
            const prefix = el.getAttribute('prefix');
            if (el.className.indexOf('selected') > -1 && prefix !== 'chat') {
                el.className = 'card-item';
            } else {
                controlEles.forEach(e => {
                    e.className = 'card-item';
                });
                if(postReqControl.includes(prefix)) {
                    const type = el.getAttribute('data-type');
                    postReq(promptEl?.value, type, prefix);
                    setSelectedItem('chat');
                } else {
                    el.className += ' selected';
                }
                sendTA(`${TA_PREFIX}_${prefix}.click`);
            }
        });
    });

    const shortFuncEls = document.querySelectorAll('.short-funciton');
    shortFuncEls.forEach(el => {
        el.addEventListener('click', e => {
            setSelectedItem('chat');
            postReq(e.target.innerHTML);
            sendTA({ id: `${TA_PREFIX}_fastInput.click`, message: e.target.innerHTML });
        });
    });

    // 发送按钮点击事件
    const sendEle = document.querySelector('#send');
    sendEle?.addEventListener('click', e => {
        postReq(promptEl?.value);
        sendTA({ id: `${TA_PREFIX}_send.click`, message: promptEl?.value });
        promptEl.value = '';
    });

    // 删除会话
    const delEl = document.querySelector('.delete-session');
    const deleteChatList = () => {
        const chatItemEl = document.querySelectorAll('.chat-item');
        
        for(let i = 1; i < chatItemEl.length; i++) {
            const parent = chatItemEl[i].parentNode;
            parent?.removeChild(chatItemEl[i]);
        }
    };
    delEl?.addEventListener('click', e => {
        stopStream();
        cs.clear();
        // 1. 删除sessionid
        vscode.postMessage({
            type: 'session',
            value: {
                sessionId: window.currentSessionId,
                prefix: 'delete'
            },
        });
        // // 2. 获取新的sesssion
        getSessionId();
        // 3. 清空会话历史节点
        deleteChatList();
        sendTA(`${TA_PREFIX}_clearSession.click`);
    });

    // 获取sessionid
    window.currentSessionId = '';
    getSessionId();

    // 监听session消息
    const handleSessionMessage = message => {
        const sessionValue = JSON.parse(message.value);
        window.currentSessionId = sessionValue.id;
        if(sessionValue.promptContext.length === 0) {
            deleteChatList();
        } else {
            initChatList(sessionValue.promptContext);
        }
    };
    // 监听我发送的消息
    const handleYouMsg = message => {
        const value = JSON.parse(message.value);
        appendChat(value.value, 'You');
        loadingInstance.loading();
    };
    // 监听异常信息
    const handleError = message => {
        const content = JSON.parse(message.value);
        window.messageCom.show({ message: content });
    };
    const messageStrategy = {
        session: handleSessionMessage,
        yourMsg: handleYouMsg,
        // error: handleError
    };
    // 监听插件回传信息
    window.addEventListener('message', (event) => {
        const message = event.data;
        if(messageStrategy[message.type]) {
            messageStrategy[message.type](message);
        } else {
            loadingInstance.remove();
            console.log(event.data.value);
            cs.run(JSON.parse(event.data.value), 'HiPilot');
        }
    });

    window.addEventListener('load', () => {
        sendTA('pc_web_ths_vscode_plugin');
    });
})();
