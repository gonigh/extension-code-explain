
export interface ISercive {
    setStreamUpdate(func: (type: string, value: string) => void): void;

    run(value: any): Promise<string>;
}
