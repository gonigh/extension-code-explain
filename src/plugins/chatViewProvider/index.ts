import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"

import { ISercive } from "../../service/IService"
import { ChatService } from "../../service/chatService"
import { SessionService } from "../../service/sessionService"
import { InsertService } from "../../service/insertService"
import { EventStore } from "../../store/eventStore"
import { FunctionService } from "../../service/functionService"

export class ChatViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = "HexinCopilot.chat-view"

	private _view?: vscode.WebviewView

	private _extensionUri: vscode.Uri

	private _serviceMap: Map<string, ISercive> = new Map()

	constructor(private readonly _extensionContext: vscode.ExtensionContext) {
		this._extensionUri = _extensionContext.extensionUri

		// 注册需要的服务
		const serviceList = [
			ChatService,
			SessionService,
			InsertService,
			FunctionService
		]
		serviceList.forEach(item => {
			this._serviceMap.set(item.type, new item())
		})

		const callback = (msg: any) => {
			if (this._serviceMap.has(msg.value.type)) {
				const service = this._serviceMap.get(msg.value.type)
				service?.setStreamUpdate(this._streamUpdate())
				service?.run(msg.value.scene).then(res => {
					if (res !== "") {
						this.postRes(1, msg.value.type, res)
					}
				})
			}
		}
		EventStore.onMessage(callback.bind(this))
	}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		this._view = webviewView

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
			localResourceRoots: [this._extensionUri]
		}

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)

		webviewView.webview.onDidReceiveMessage(async data => {
			if (this._serviceMap.has(data.type)) {
				const service = this._serviceMap.get(data.type)
				service?.setStreamUpdate(this._streamUpdate(data.id))
				service
					?.run(data.value)
					.then(res => {
						if (JSON.parse(res).value !== "") {
							this.postRes(1, data.type, res)
						}
					})
					.catch((err: Error) => {
						this.postRes(1, "error", err.message)
					})
			}
		})
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const markedUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media/chat", "marked.min.js")
		)
		const commonUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media/chat", "common.js")
		)
		const chatUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media/chat", "index.js")
		)
		const taUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media", "ta.min.js")
		)
		const highlightUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media/chat", "highlight.min.js")
		)
		const messageUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media/chat", "message.js")
		)

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
		)
		const styleVSCodeUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
		)
		const styleMainUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media", "main.css")
		)
		const styleChatUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media/chat", "index.css")
		)
		const styleMonokaiUri = webview.asWebviewUri(
			vscode.Uri.joinPath(
				this._extensionUri,
				"media/chat",
				"monokai_sublime.min.css"
			)
		)

		// images
		const youAvatarUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media", "chat/images/you.png")
		)
		const gptAvatarUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "media", "chat/images/gpt.png")
		)

		const html = `
		<!doctype html>
		<html>
		
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Marked in the browser</title>
			<link href="${styleResetUri}" rel="stylesheet">
			<link href="${styleVSCodeUri}" rel="stylesheet">
			<link href="${styleMainUri}" rel="stylesheet">
			<link href="${styleChatUri}" rel="stylesheet">
			<link href="${styleMonokaiUri}" rel="stylesheet">
		</head>
		
		<body>
			<div class="container">
				<div class="header-container">
					<div class="handle-container">
						<div class="handle-item delete-session" title="删除会话">
						<svg t="1691652951276" class="delete-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" p-id="20825" width="16" height="16"><path d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z" p-id="20826"></path></svg>
							<span>Delete</span>
						</div>
					</div>
				</div>
				<div class="chat-container">
					<div class="chat-item">
						<div class="userinfo">
							<img class="avatar" src="${gptAvatarUri}">
							<span>Hexin Copilot</span>
						</div>
						<div class="normal-text">试试发送一些问题给我，或者使用以下快捷功能：</div>
						<div>
							<button class="short-funciton">介绍一下React Hooks</button>
							<button class="short-funciton">给我一个JavaScript倒计时的组件</button>
						</div>
					</div>
				</div>	
				<div class="control-container">
					<div class="input-container">
						<input class="input" id="prompt" placeholder="输入内容开始聊天" />
						<div class="send" id="send">
							<svg t="1691570436778" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" p-id="15894" width="16" height="16"><path d="M955 125.6c-4.5-12.5-15.4-21.8-28.6-24.2-9.2-1.7-18.4 0.1-26.1 4.8L83.9 544.3c-12.8 6.8-20.6 20.6-19.8 35.1 0.8 14.3 9.9 27.3 23.2 32.9l238.5 97.9c12.4 5.2 26.8 3.4 37.5-4.9s16.1-21.3 14.4-34.8c-1.6-13.2-10.4-24.6-23-29.9l-165-67.7 573-307.3-357 421.9c-6.5 7.7-9.6 17.4-8.8 27.4L411.4 884c1.6 19.7 17.7 34.6 37.5 34.6 9.5 0 18.7-3.7 25.8-10.4l74-69.2 0.1-0.1c13.5-13.2 15.2-33.5 4.8-48.4l222.6 72c4 1.3 7.9 2 11.7 2 18.2 0 33.8-12.9 37-30.6l131.6-688.3h-0.1c1.4-6.6 0.9-13.5-1.4-20zM497.3 783.8L479.9 800l-6.5-75.9L856 271.6l-96.8 506.3L539 706.6c-19.7-6.4-41.1 4.4-47.5 24.2-5.8 17.9 2.5 37.1 18.9 45.4-4.7 1.5-9.2 4-13.1 7.6z" p-id="15895"></path></svg>
						</div>
					</div>
				</div>
			</div>
			<script src="//s.thsi.cn/js/common/b2c/ta/ta.min.js"></script>
			<script>
				window._IMAGE_URLS = {
					youAvatar: "${youAvatarUri}",
					gptAvatar: "${gptAvatarUri}"
				};
			</script>
			<script src="${taUri}"></script>
			<script src="${markedUri}"></script>
			<script src="${highlightUri}"></script>
			<script src="${messageUri}"></script>
			<script src="${commonUri}"></script>
			<script src="${chatUri}"></script>
		</body>
		
		</html>
		`
		return html
	}

	/**
	 * 与webview页面通信
	 * @param type 功能
	 * @param res 响应结果
	 */
	public postRes(id: number, type: string, value: string) {
		this._view?.webview.postMessage({ id, type, value })
	}

	private _streamUpdate(id?: number) {
		return (type: string, value: string) => {
			this._view?.webview.postMessage({ id, type, value })
		}
	}
}
