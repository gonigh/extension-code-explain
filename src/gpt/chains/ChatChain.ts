import { EventStore } from "../../store/eventStore";
import { SessionStore } from "../../store/sessionStore";
import { MessageInterface, SessionInterface } from "../../type";
import { request } from "../request";
import { IChain } from "./IChain";

export class ChatChain implements IChain {
    public static type: string = 'chat'
    private _sesstionStore: SessionStore = SessionStore.getInstance();
    public run(prompt: string): void {
        const session = this._sesstionStore.getCurrentSession() as SessionInterface;
        
        let flag = true;
        EventStore.onStop(()=>{
            flag = false;
        });
        const context: MessageInterface[] = this._sesstionStore.getCurrentSession().promptContext;
        request(prompt, context).then(res => {
            const answer = res.data.data.res;
            if(flag){
                EventStore.emitChunk({
                    value: answer,
                    finish: false
                });
                EventStore.emitChunkEnd();
            }
        }).catch(e => EventStore.emitError(new Error('请求出错')));
    }
}