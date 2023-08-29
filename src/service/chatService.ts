import { ISercive } from './IService';
import { SessionStore } from '../store/sessionStore';
import { GPT } from '../gpt';
import { MessageRoleEnum } from '../type/enums';
import { EventStore } from '../store/eventStore';
import { SessionInterface } from '../type';

export class ChatService implements ISercive {

    public static readonly type = 'chat';

    private _sessionStore: SessionStore = SessionStore.getInstance();

    private _gpt = new GPT();

    private _streamUpdate: ((type: string, value: string) => void) | undefined;

    constructor() {
    }

    public setStreamUpdate(func: (type: string, value: string) => void): void {
        this._streamUpdate = func;
    }

    public run({ value, sessionId }: { value: string, sessionId?: number }): Promise<string> {
        if (this._streamUpdate) {
            const inputValue = {
                value,
                finish: true
            };
            this._streamUpdate('yourMsg', JSON.stringify(inputValue));
        }
        return new Promise((resolve, reject) => {
            const session = this._sessionStore.getCurrentSession() as SessionInterface;

            let answer = '';
            const callback = (postValue: {
                value: string,
                finish: boolean
            }) => {

                if (postValue.value !== null) {
                    answer += postValue.value;
                }
                // console.log(postValue.value);
                
                if (this._streamUpdate) {
                    this._streamUpdate(ChatService.type, JSON.stringify(postValue));
                }
            };
            const endCallback = () => {
                const postValue = {
                    value: '',
                    finish: true
                };

                if(answer === '') {
                    answer = '很抱歉，我不理解你的输入。你能提供更多关于你想要完成的事情的信息或背景吗?';
                    postValue.value = answer;
                }

                // 更新上下文
                this._sessionStore.pushPromptContext(session.id, [{
                    role: MessageRoleEnum.USER,
                    content: value,
                }, {
                    role: MessageRoleEnum.ASSISTANT,
                    content: answer,
                }]);
                resolve(JSON.stringify(postValue));
            }

            // TODO 其他异常情况判断
            const errorCallback = (err: Error) => {
                reject(JSON.stringify({
                    value: err,
                    finish: true
                }));
            }

            EventStore.onChunk(callback.bind(this));
            EventStore.onChunkEnd(endCallback.bind(this));
            EventStore.onError(errorCallback.bind(this));
            // 发起请求后通过streamEmitter接收消息
            this._gpt.chat(value);
        });

    }
}
