import { MessageRoleEnum } from "./enums";

export declare interface MessageInterface {

    role: MessageRoleEnum;

    content: string;
}

export declare interface SessionInterface {

    id: number;

    updateTime: Date;

    promptContext: MessageInterface[];

}
