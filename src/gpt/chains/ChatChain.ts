import { EventStore } from "../../store/eventStore";
import { SessionStore } from "../../store/sessionStore";
import { MessageInterface, SessionInterface } from "../../type";
import { request } from "../request";
import { IChain } from "./IChain";

export class ChatChain implements IChain {
    public static type: string = 'chat'
    private _sesstionStore: SessionStore = SessionStore.getInstance();
    public run(prompt: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const session = this._sesstionStore.getCurrentSession() as SessionInterface;

            let flag = true;
            EventStore.onStop(() => {
                flag = false;
            });
            const context: MessageInterface[] = this._sesstionStore.getCurrentSession().promptContext;
            const res = await request(prompt, context)
            const answer = res.data.data.res;
            if (flag) {
                EventStore.emitChunk({
                    value: answer,
                    finish: false
                });
            }
        })

    }
}