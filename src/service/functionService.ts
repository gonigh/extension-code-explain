import { ISercive } from './IService';
import { SessionStore } from '../store/sessionStore';
import { GPT } from '../gpt';
import { MessageRoleEnum, SceneEnum } from '../type/enums';
import { EventStore } from '../store/eventStore';
import { SessionInterface } from '../type';
import * as vscode from 'vscode';

export class FunctionService implements ISercive {

    public static readonly type = 'function';

    private _sessionStore: SessionStore = SessionStore.getInstance();

    private _gpt = new GPT();

    private _streamUpdate: ((type: string, value: string) => void);

    constructor() {
        this._streamUpdate = (type: string, value: string) => { };
    }

    public setStreamUpdate(func: (type: string, value: string) => void): void {
        this._streamUpdate = func;
    }

    public run(scene: SceneEnum): Promise<string> {
        return new Promise((resolve, reject) => {

            let selectedText = '';
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage('No active editor found.');
                return;
            }
            const selection = editor.selection;
            selectedText = editor.document.getText(selection);

            // 错误报告
            if (selectedText.length === 0) {
                reject(JSON.stringify({
                    value: '选中区域为空',
                    finish: true
                }));
                return;
            }

            let contextInput = `${scene}\n`;
            contextInput += '```javascript\n';
            contextInput += selectedText;
            contextInput += '\n```\n';
            const inputValue = {
                value: contextInput,
                finish: true
            };

            this._streamUpdate('yourMsg', JSON.stringify(inputValue));

            const session = this._sessionStore.getCurrentSession() as SessionInterface;
            // 发起请求后通过streamEmitter接收消息
            this._gpt.functionChat(selectedText, scene);

            let answer = '';
            const callback = (postValue: {
                value: string,
                finish: boolean
            }) => {
                if (postValue.value !== null) {
                    answer += postValue.value;
                }
                if (this._streamUpdate){
                    this._streamUpdate(FunctionService.type, JSON.stringify(postValue));
                }
            };
            const endCallback = () => {
                const postValue = {
                    value: '',
                    finish: true
                };

                // 更新上下文
                this._sessionStore.pushPromptContext(session.id, [{
                    role: MessageRoleEnum.USER,
                    content: contextInput,
                }, {
                    role: MessageRoleEnum.ASSISTANT,
                    content: answer,
                }]);
                resolve(JSON.stringify(postValue));
            }
            EventStore.onChunk(callback.bind(this));
            EventStore.onChunkEnd(endCallback.bind(this));
        });

    }
}
