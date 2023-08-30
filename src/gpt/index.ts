import { SceneEnum } from "../type/enums";
import { getSelectCode } from "../utils";
import { ChatChain } from "./chains/ChatChain";
import { CodeExplainChain } from "./chains/CodeExplainChain";
import { IChain } from "./chains/IChain";
import { getSceneName } from "./roles/distributor";


export class GPT {

    private _chains: Map<string, IChain> = new Map([
        [ChatChain.type, new ChatChain()],
        [CodeExplainChain.type, new CodeExplainChain()]
    ]);

    constructor() { }

    public chat(prompt: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const chainList = [];
            const code = getSelectCode();
            if (code !== '') {
                // 判断是普通对话还是针对代码的场景对话
                const sceneList = await getSceneName(prompt);
                if (sceneList.length > 0) {
                    for(const scene of sceneList){
                        if(this._chains.has(scene)) {
                            await this._chains.get(scene)?.run(code);
                        }
                    }
                } else {
                    this._chains.get(ChatChain.type)?.run(prompt);
                }
            } else {
                this._chains.get(ChatChain.type)?.run(prompt);
            }
            
        })
    }

    public functionChat(prompt: string, scene: SceneEnum) {
        this._chains.get(scene)?.run(prompt);
    }
}

