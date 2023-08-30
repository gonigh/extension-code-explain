import { SessionInterface } from "../type";
import { SceneEnum } from "../type/enums";

export interface IGPT {
    chat(prompt: string): void;

    functionChat(prompt: string, scene: SceneEnum): void;
}