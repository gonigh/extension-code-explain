import { EventStore } from "../../store/eventStore";
import { explain } from "../roles/explainer";
import { variableCheck } from "../roles/variableCheck";
import { IChain } from "./IChain";

export class CodeExplainChain implements IChain {
    public static type: string = 'code-explain'

    public run(prompt: string): Promise<void> {
        return new Promise(async (resolve) => {
            // 判断是否存在未知代码
            const variableList: string[] = await variableCheck(prompt);
            let variableContext: string = '';
            if (variableList.length > 0) {
                // 获取未知变量定义上下文

            }
            const answer: string = await explain(variableContext + prompt);

            // 输出格式化
            const output = `#### 代码解释\n\n${answer}\n`;
            EventStore.emitChunk({
                value: output,
                finish: false
            });
            EventStore.emitChunkEnd();
        })
    }
}
