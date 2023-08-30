import { MessageInterface } from "../../type";
import { MessageRoleEnum } from "../../type/enums";
import { strToArray } from "../../utils";
import { request } from "../request";

export const getSceneName = (prompt: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const systemPrompt = `判断以下对话涉及的场景，场景包括代码解释、代码问题检查、代码优化这三个，
        输出涉及场景的字符串数组，
        涉及代码解释数组加入'code-explain',
        涉及代码问题检查数组加入'question-scan',
        涉及代码优化数组加入'code-optimization'`;
        const userPrompt = '检查以下这段代码有什么问题，以及怎么优化';
        const assistantPrompt = `['question-scan','code-optimization']`;
        const context: MessageInterface[] = [
            {role: MessageRoleEnum.SYSTEM, content: systemPrompt},
            {role: MessageRoleEnum.USER, content: userPrompt},
            {role: MessageRoleEnum.ASSISTANT, content: assistantPrompt}
        ];
        let array: string[] = [];
        request(prompt, context).then(res => {
            let str = res.data.data.res;
            const array = strToArray(str);
            for(let i = 0; i < array.length; i++) {
                if(array[i] !== 'code-explain' && array[i] !== 'question-scan' && array[i] !== 'code-optimization') {
                    reject([])
                }
            }
            resolve(array);
        }).catch(err => {
            reject([]);
        })
    })
}