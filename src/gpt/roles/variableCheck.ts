import { MessageInterface } from "../../type";
import { MessageRoleEnum } from "../../type/enums";
import { strToArray } from "../../utils";
import { request } from "../request";

export const variableCheck = (code: string): Promise<string[]>=>{
    return new Promise((resolve, reject) => {
        const systemPrompt = `检查代码中是否存在不明确的变量，输出由未知变量组成的字符串数组`;
        const userPrompt = 'let str = res.data.data.res;';
        const assistantPrompt = `['res']`;
        const context: MessageInterface[] = [
            {role: MessageRoleEnum.SYSTEM, content: systemPrompt},
            {role: MessageRoleEnum.USER, content: userPrompt},
            {role: MessageRoleEnum.ASSISTANT, content: assistantPrompt}
        ];
        
        request(code, context).then(res => {
            let str = res.data.data.res;
            let array: string[] = strToArray(str);
            array = array.filter(item => code.indexOf(item) !== -1);
            resolve(array);
        }).catch(err => {
            reject([]);
        })
    })
}