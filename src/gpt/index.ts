import { SceneEnum } from "../type/enums";
import { ChatChain } from "./chains/ChatChain";
import { CodeExplainChain } from "./chains/CodeExplainChain";
import { IChain } from "./chains/IChain";


export class GPT {

    private _chains: Map<string, IChain> = new Map([
        [ChatChain.type, new ChatChain()],
        [CodeExplainChain.type, new CodeExplainChain()]
    ]);

    constructor() {}

    public chat(prompt: string): void {
        this._chains.get(ChatChain.type)?.run(prompt);

    }

    public functionChat(prompt: string, scene: SceneEnum) {
        this._chains.get(scene)?.run(prompt);
    }
}

