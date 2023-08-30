import { SessionInterface } from "../type";
import { GptModelEnum, SceneEnum } from "../type/enums";
import { ChatGpt } from "./chatGPT";
import { IGPT } from "./IGpt";


export class GPT {

    private _gptMap = new Map<GptModelEnum, IGPT>();

    constructor() {
        const gptList = [ChatGpt];
        gptList.forEach((GPT) => {
            this._gptMap.set(GPT.type, new GPT());
        });
    }

    public chat(prompt: string): void {
        const gpt: IGPT = this._gptMap.get(GptModelEnum.OPENAI) as IGPT;
        gpt.chat(prompt);

    }

    public functionChat(prompt: string, scene: SceneEnum) {
        const gpt: IGPT = this._gptMap.get(GptModelEnum.OPENAI) as IGPT;

        return gpt.functionChat(prompt, scene);

    }
}

