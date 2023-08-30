import axios from "axios";
import { MessageInterface } from "../type";

export const request = function(prompt: string, context?: MessageInterface[]): Promise<any> {
    const param = {
        content:prompt,
        source: 'homework-47-huangchenze@myhexin',
        token: '610EE45BF-Qtc2VydmU=',
        temperature: 0.1,
        context
    };
    return axios.post('https://frontend.myhexin.com/kingfisher/robot/homeworkChat', param)
}