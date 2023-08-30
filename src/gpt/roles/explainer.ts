import { MessageInterface } from "../../type";
import { MessageRoleEnum } from "../../type/enums";
import { strToArray } from "../../utils";
import { request } from "../request";

export const explain = (code: string): Promise<string> =>{
    return new Promise((resolve, reject) => {
        const systemPrompt = `你是一个前端领域专家，用简洁的语言解释一下以下代码`;
        const context: MessageInterface[] = [
            {role: MessageRoleEnum.SYSTEM, content: systemPrompt},
        ];
        let array: string[] = [];
        request(code, context).then(res => {
            let str = res.data.data.res;
            resolve(str);
        }).catch(err => {
            reject([]);
        })
    })
}