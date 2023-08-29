import { MessageInterface, SessionInterface } from "../type";
import { GptModelEnum, MessageRoleEnum, SceneEnum } from "../type/enums";
import { IGPT } from "./IGpt";
import { SessionStore } from "../store/sessionStore";
import { EventStore } from "../store/eventStore";
import axios from "axios";
import { IChain } from "./chains/IChain";
import { CodeExplainChain } from "./chains/CodeExplainChain";
import { request } from "./request";
import { ChatChain } from "./chains/ChatChain";

export class ChatGpt implements IGPT {

    public static readonly type: GptModelEnum = GptModelEnum.OPENAI;

    private _sesstionStore: SessionStore = SessionStore.getInstance();

    private _chains:Map<string, IChain> = new Map([
        [ChatChain.type, new ChatChain()],
        [CodeExplainChain.type, new CodeExplainChain()]
    ]);

    public chat(prompt: string): void {
        this._chains.get(ChatChain.type)?.run(prompt);
    };


    // 功能调用
    public functionChat(prompt: string, scene: SceneEnum): void {
        this._chains.get(scene)?.run(prompt);
    }

}
