import { EventStore } from "../../store/eventStore";
import { MessageInterface } from "../../type";
import { IChain } from "./IChain";
import { MessageRoleEnum } from "../../type/enums";
import { request } from "../request";
import { getFileType } from "../../utils";

export class CodeScanChain implements IChain {
    public static type: string = 'code-scan';

    public run(prompt: string): Promise<void> {
        return new Promise(async (resolve) => {

            const lang:string = getFileType();
            const scanPrompt: string = `你是一个${lang}开发专家，检查以下代码存在哪些问题，问题可能包括安全隐患和性能隐患等，逐一列出问题，语言尽量简洁`;
            // 检查代码问题
            let context: MessageInterface[] = [
                { role: MessageRoleEnum.SYSTEM, content: scanPrompt },
            ];
            const question: string = await this.getAnswer(prompt, context);
            const questionOutput = `- 存在问题\n${question}\n`;

            EventStore.emitChunk({
                value: questionOutput,
                finish: false
            });

            context = [...context,
            {
                role: MessageRoleEnum.USER,
                content: prompt
            }, {
                role: MessageRoleEnum.ASSISTANT,
                content: question
            }];
            // 输出格式化
            const optimizePrompt = `作为${lang}开发专家对这段代码进行优化，输出优化后的代码`;
            const optimizeCode = await this.getAnswer(optimizePrompt, context);
            const optimizeOutput = `\n- 代码优化：\n${optimizeCode}`;
            EventStore.emitChunk({
                value: optimizeOutput,
                finish: false
            });
            EventStore.emitChunkEnd();
        });
    }

    private getAnswer = (code: string, context: MessageInterface[]): Promise<string> => {
        return new Promise((resolve, reject) => {
            request(code, context).then(res => {
                let str = res.data.data.res;
                resolve(str);
            }).catch(err => {
                reject([]);
            });
        });
    };
}
