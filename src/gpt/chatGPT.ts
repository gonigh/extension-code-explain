import { SessionInterface } from "../type";
import { GptModelEnum, MessageRoleEnum, SceneEnum } from "../type/enums";
import { IGPT } from "./IGpt";
import { SessionStore } from "../store/sessionStore";
import { EventStore } from "../store/eventStore";
import axios from "axios";

export class ChatGpt implements IGPT {

    public static readonly type: GptModelEnum = GptModelEnum.OPENAI;

    private _sesstionStore: SessionStore = SessionStore.getInstance();

    public chat(prompt: string): void {
        const session = this._sesstionStore.getCurrentSession() as SessionInterface;
        
        let flag = true;
        EventStore.onStop(()=>{
            flag = false;
        });
        this.request(prompt).then(res => {
            const answer = res.data.data.res;
            if(flag){
                EventStore.emitChunk({
                    value: answer,
                    finish: false
                });
                EventStore.emitChunkEnd();
            }
        }).catch(e => EventStore.emitError(new Error('请求出错')));
    };


    // 功能调用
    public functionChat(prompt: string, scene: SceneEnum): void {
    }

    private request(prompt: string): Promise<any> {
        const session = this._sesstionStore.getCurrentSession() as SessionInterface;
        const param = {
            content:`${prompt}`,
            source: 'homework-47-huangchenze@myhexin',
            token: '610EE45BF-Qtc2VydmU=',
            temperature: 0.1,
            context: session.promptContext
        };
        return axios.post('https://frontend.myhexin.com/kingfisher/robot/homeworkChat', param)
    }

}
