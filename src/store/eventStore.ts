import { EventEmitter } from "stream";

export class EventStore {
    private static _streamEmitter = new EventEmitter();

    /**
     * 处理数据单块chunk的通信
     * @param value 
     */
    public static emitChunk(value: any) {
        this._streamEmitter.emit('chunk', value);
    }

    public static onChunk(callback: (value: any) => void) {
        this._streamEmitter.on('chunk', callback);
    }

    /**
     * 数据流结束时通信
     */
    public static emitChunkEnd() {
        console.log('end');
        
        this._streamEmitter.emit('chunkEnd');
    }

    public static onChunkEnd(callback: () => void) {
        this._streamEmitter.on('chunkEnd', () => {
            callback();
            // 消费完成后清除之前注册的chunk事件
            this._streamEmitter.removeAllListeners('chunk');
            this._streamEmitter.removeAllListeners('chunkEnd');
        });
    }

    /**
     * 停止数据传输事件
     */
    public static emitStop() {
        this._streamEmitter.emit('stop');
    }

    public static onStop(callback: () => void) {
        this._streamEmitter.on('stop', ()=>{
            callback();
            
            this._streamEmitter.removeAllListeners('stop');
            this._streamEmitter.removeAllListeners('chunk');
            this._streamEmitter.removeAllListeners('chunkEnd');
        });
    }

    /**
     * 请求过程中出现错误
     * @param err 错误信息
     */
    public static emitError(err: Error) {
        console.log(err);
        
        this._streamEmitter.emit('error', err);
        this._streamEmitter.emit('stop');
    }

    public static onError(callback: (err: Error) => void) {
        this._streamEmitter.on('error', callback);
    }

    /**
     * 插件模块间通信
     * @param msg 消息内容
     */
    public static emitMessage(msg: any) {
        this._streamEmitter.emit('message', msg);
    }

    public static onMessage(callback: (msg: any) => void) {
        this._streamEmitter.on('message', callback);
    }
}
