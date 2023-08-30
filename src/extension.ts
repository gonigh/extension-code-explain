import * as vscode from 'vscode';
import { ChatViewProvider } from './plugins/chatViewProvider';
import { SessionStore } from './store/sessionStore';
import { CodeExplain, TestUnit } from './plugins/menu';


export function activate(context: vscode.ExtensionContext) {
  SessionStore.initInstance(context);

  // 注册 Chat webview
  const chatViewProvider = new ChatViewProvider(context);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(ChatViewProvider.viewType, chatViewProvider, {
    webviewOptions: {
      // 让页面隐藏后依然处于激活态
      retainContextWhenHidden: true,
    }
  }));

  // 注册右键事件
  const menuGroup = [CodeExplain, TestUnit];
  menuGroup.forEach(item => {
    let disposable = vscode.commands.registerCommand(item.command, item.run);
    context.subscriptions.push(disposable);
  });
  
}

export function deactivate() {
  // 当插件被禁用时，此方法将被调用
}

