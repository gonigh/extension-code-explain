import { EventStore } from "../store/eventStore";
import { SceneEnum } from "../type/enums";
import { ChatChain } from "./chains/ChatChain";
import { CodeExplainChain } from "./chains/CodeExplainChain";
import { CodeScanChain } from "./chains/CodeScanChain";
import { IChain } from "./chains/IChain";


export class GPT {

    private _chains: Map<string, IChain> = new Map([
        [ChatChain.type, new ChatChain()],
        [CodeExplainChain.type, new CodeExplainChain()],
        [CodeScanChain.type, new CodeScanChain()]
    ]);

    constructor() { }

    public chat(prompt: string): void {
        this._chains.get(ChatChain.type)?.run(prompt)
            .catch(e => {
                console.error(e);
                EventStore.emitChunk({
                    value: '请求出错了',
                    finish: false
                });
                EventStore.emitChunkEnd();
            });
    }

    public functionChat(prompt: string, scene: SceneEnum): void {
        this._chains.get(scene)?.run(prompt)
            .catch(e => {
                console.error(e);
                EventStore.emitChunk({
                    value: '请求出错了',
                    finish: false
                });
                EventStore.emitChunkEnd();
            });
    }
}

