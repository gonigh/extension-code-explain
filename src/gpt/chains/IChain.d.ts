export interface IChain {
    run(prompt: string): Promise<void>
}