const APP_NAME = 'HiPilot';
const TA_PREFIX = 'pc_web_ths_vscode_plugin';

/**
 * 发送埋点
 * @param {*} arg
 */
const sendTA = (arg) => {
  try {
    const base = window._vscodeEnv || {};
    const params = Object.assign(base, typeof arg === 'string' ? { id: arg } : arg);
    window.TA.log(params);
  } catch (error) {
    console.error(error);
  }
};

/**
 * loading组件
 */
class LoadingComponent {
  constructor() {
    this.chat = null;
  }
  loading() {
    const list = document.querySelector('.chat-container');
    this.chat = document.createElement('div');
    this.chat.classList.add('chat');
    this.chat.classList.add('loading-main');
    this.chat.innerHTML = `<div class="chat-item ${APP_NAME}">
                        <div class="userinfo">
                            <img class="avatar" src="${window._IMAGE_URLS.gptAvatar}">
                            <span>${APP_NAME}</span>
                        </div>
                        <div class="chat-content">正在思考中...</div>
                    </div>`;
    list.appendChild(this.chat);
    scrollToBottom();
  }
  remove() {
    if (this.chat) {
      const list = document.querySelector('.chat-container');
      list.removeChild(this.chat);
      this.chat = null;
    }
  }
}

// 重写 marked 的 render需要的编码函数
const escape = (html, encode) => {
  const escapeTest = /[&<>"']/;
  const escapeReplace = new RegExp(escapeTest.source, 'g');
  const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
  const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');
  const escapeReplacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  const getEscapeReplacement = (ch) => escapeReplacements[ch];
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }

  return html;
};

/**
 * 向插件发送请求
 * @param {*} value
 */
const postReq = (value, _type, _prefix) => {
  // 流数据正在传输中，不允许再次发送
  if (cs.startStream) {
    return;
  }
  const { type, prefix } = getSelectedItem();
  vscode.postMessage({
    type: _type || type,
    value: {
      sessionId: window.currentSessionId,
      value,
      prefix: _prefix || prefix,
    },
  });
  sendTA(`pc_web_ths_vscode_plugin_${type}.click`);
};

/**
 * 滚动到底部
 */
const scrollToBottom = () => {
  const list = document.querySelector('.chat-container');
  list.scrollTop = list.scrollHeight;
};

/**
 * 获取sessionid
 */
const getSessionId = () => {
  vscode.postMessage({
    type: 'session',
    value: {
      prefix: 'get',
    },
  });
};

/**
 * 停止流
 */
const stopStream = () => {
  vscode.postMessage({
    type: 'session',
    value: {
      prefix: 'stop',
    },
  });
};

/**
 * 处理流式消息
 */
class ChatStream {
  constructor() {
    this.startStream = false;
    this.chat = null;
    this.message = '';
    this.scroll = false;
    this.scrollToBottom = true;
    this.stopStream = false;
    this.list = document.querySelector('.chat-container');
    this.list.addEventListener('scroll', () => {
      this.scroll = true;
    });
  }
  run(msg, role) {
    try {
      this.message += msg.value.toString();
    } catch (error) {
      console.log(msg);
    }
    if (!this.startStream) {
      // 初始化节点
      this.startStream = true;
      this.init(msg.value, role);
    } else {
      // 追加流式内容
      this.append();
    }

    if (msg.finish) {
      // 结束流
      this.clear();
      hljs.initHighlighting();
    }
  }

  // 初始化节点
  init(msg, role) {
    const avatar = {
      You: window._IMAGE_URLS.youAvatar,
      HiPilot: window._IMAGE_URLS.gptAvatar,
      hxGPT: window._IMAGE_URLS.gptAvatar,
      InstantCoder: window._IMAGE_URLS.gptAvatar,
    };
    this.chat = document.createElement('div');
    this.chat.classList.add('chat');
    this.chat.innerHTML = `<div class="chat-item ${role}">
                        <div class="userinfo">
                            <img class="avatar" src="${avatar[role]}">
                            <span>${role}</span>
                            <div class="zan">
								<svg t="1691996719070" class="icon point-like pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26470" width="18" height="18">
                                    <path d="M160 906.666667a64 64 0 0 1-64-64v-384a64 64 0 0 1 64-64h145.024c17.664-36.864 51.690667-101.888 113.834667-219.648 31.296-55.146667 100.970667-74.133333 155.434666-42.154667 54.186667 31.786667 77.44 98.688 55.082667 157.802667l-28.437333 75.093333h213.504c62.826667 0 113.557333 51.562667 113.557333 114.922667 0 6.570667-0.554667 13.141333-1.664 19.626666l-44.373333 259.477334c-14.506667 84.8-87.104 146.88-172.181334 146.88H160zM474.986667 205.738667a16255.445333 16255.445333 0 0 0-94.976 182.122666c-10.453333 20.48-18.24 36.096-23.36 46.762667a371.626667 371.626667 0 0 0-4.650667 10.069333l0.042667 397.973334h357.738666c53.717333 0 99.818667-39.424 109.098667-93.653334l44.373333-259.498666c0.490667-2.922667 0.746667-5.866667 0.746667-8.832 0-28.245333-22.314667-50.922667-49.578667-50.922667h-306.133333l61.226667-161.749333c11.370667-30.037333-0.426667-64-27.605334-79.957334a48.64 48.64 0 0 0-66.922666 17.706667zM288 458.666667h-128v384h128v-384z" p-id="26471"></path>
                                </svg>
								<svg t="1691996525157" class="icon ml-8 point-unlike pointer" viewBox="0 0 1024 1024" version="1.1" p-id="24318" width="14" height="14">
									<path d="M300 608.864V88h477.916c25.815 0 41.979 5.525 51.808 14.617 6.238 6.125 9.602 13.574 10.735 20.38l0.438 2.633 92.314 402.165 0.176 0.712c5.816 23.53 1.843 43.53-10.447 59.143-9.517 11.702-32.017 21.182-59.61 21.182H546.349l72.213 130.586c7.856 14.206 15.912 31.605 23.947 53.053 10.618 28.344 20.148 61.09 28.115 98.645 0.036 0.32-0.053 0.518-0.461 1.612-1.324 3.544-4.218 8.523-9.47 15.814C644.654 926.839 623.467 936 594.813 936c-18.135 0-28.537-4.288-37.618-12.874-8.405-7.946-14.718-17.855-25.561-39.254l-5.634-11.118-5.344-5.732c-0.433-0.72-0.918-1.551-1.444-2.474-1.787-3.135-7.986-14.904-10.1-18.652l0.01-0.006c-25.204-43.028-36.934-62.463-52.366-85.841-21.447-32.49-42.12-59.384-64.482-82.682-28.251-29.434-58.872-52.508-92.273-68.503z m-88-24.668a289.824 289.824 0 0 0-29.43-1.476H97.667c-6.617 0-8.667-2.052-8.667-8.768V96.256C89 90.049 91.054 88 97.667 88H212v496.196z m483.57 112.636h167.76c53.193 0 101.27-20.48 128.379-54.272 29.665-37.376 39.382-85.504 27.107-135.168l-91.552-398.848c-2.557-15.36-10.74-44.544-36.826-69.632C863.331 13.312 825.482 0 777.916 0H97.667C42.429 0 1 41.472 1 96.256v477.696c0 55.296 41.429 96.768 96.667 96.768h84.903c121.729 0 184.64 107.008 250.618 219.648 1.535 2.56 12.787 25.6 19.947 33.28C471.037 958.976 504.282 1024 594.811 1024c55.239 0 101.782-20.992 135.027-60.928 17.39-23.552 34.268-52.224 27.108-89.088-7.304-34.634-15.547-64.206-23.833-89.152l-37.543-88z" p-id="24319"></path>
								</svg>
                            </div>
                        </div>
                        <div class="chat-content">${marked.parse(msg)}</div>
                        <button class="stop-stream">停止生成</button>
                    </div>`;
    this.list.appendChild(this.chat);
    this.chat.addEventListener('click', (e) => {
      this.handleClick(e, this);
    });
    scrollToBottom();
  }
  handleClick(e, that) {
    if(e.target.classList.value === 'stop-stream') {
      that.handleStopStrem();
    }
  }
  // 停止流
  handleStopStrem() {
    stopStream();
    this.stopStream = true;
    this.deleteStopBtn();
  }
  // 追加流式内容
  append() {
    if(this.stopStream) {
      return; 
    }
    this.isScrollBottom();
    const chatEl = this.chat.querySelector('.chat-content');
    chatEl.innerHTML = marked.parse(this.message);
    // 没有滚动过 !this.scroll
    // 滚动过但在底部
    if (!this.scroll || (this.scroll && this.scrollToBottom)) {
      scrollToBottom();
    }
  }
  // 滚动条是否在底部
  isScrollBottom() {
    // 这里用Math.ceil为了修复vscode面板放大后导致的0.1-0.3px的像素差
    this.scrollToBottom = Math.ceil(this.list.clientHeight + this.list.scrollTop) + 3 >= this.list.scrollHeight;
  }
  // 删除停止按钮
  deleteStopBtn () {
    if(!this.chat) {
      return;
    }
    const stopBtn = this.chat.querySelector('.stop-stream');
    if(stopBtn) {
      stopBtn.style.display = 'none';
    }
  }
  clear() {
    this.deleteStopBtn();
    if(this.chat) {
      this.chat.removeEventListener('click', this.handleClick);
      this.chat = null;
    }
    this.startStream = false;
    this.message = '';
    this.stopStream = false;
    this.scroll = false;
    this.list.removeEventListener('scroll', this.handleScroll);
  }
}

// marked初始化
const rendererMD = new marked.Renderer();
marked.setOptions({
  renderer: rendererMD,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: (code) => hljs.highlightAuto(code).value,
});
// 自定义marked render用于追加复制、插入功能
const renderer = {
  code(code, infostring, escaped) {
    const lang = (infostring || '').match(/\S*/)[0];
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    code = code.replace(/\n$/, '') + '\n';

    const tools = getCodePreTools();

    if (!lang) {
      return '<pre>' + tools + '<code>' + (escaped ? code : escape(code, true)) + '</code></pre>\n';
    }

    return '<pre>' + tools + '<code class="' + escape(lang) + ' hljs">' + (escaped ? code : escape(code, true)) + '</code></pre>\n';
  },
};
marked.use({ renderer });
