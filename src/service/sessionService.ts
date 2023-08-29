import { ISercive } from './IService';
import { SessionStore } from '../store/sessionStore';
import { EventStore } from '../store/eventStore';
// coplit prompt可以参考
export class SessionService implements ISercive {

    public static readonly type = 'session';

    private _sessionStore: SessionStore = SessionStore.getInstance();

    private _streamUpdate: ((type: string, value: string) => void) | null;

    constructor() {
        this._streamUpdate = null;
    }

    public setStreamUpdate(func: (type: string, value: string) => void): void {
        this._streamUpdate = func;
    }

    public run({sessionId,prefix}: {value: string, sessionId?: number, prefix: string}): Promise<string> {
        return new Promise((resolve, reject) => {
            if(prefix === 'get') {
                // this._sessionStore.clear();
                if (sessionId) {
                    let session = this._sessionStore.get(Number(sessionId));
                    resolve(JSON.stringify(session));
                } else {
                    resolve(JSON.stringify(this._sessionStore.get()));
                }
            } else if(prefix === 'delete') {
                EventStore.emitStop();
                this._sessionStore.delete(Number(sessionId));
                let session = this._sessionStore.get();
                resolve(JSON.stringify(session));
            } else if(prefix === 'stop') {
                EventStore.emitStop();
                
            }
        });
    }

}
