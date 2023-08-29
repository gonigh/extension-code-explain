import * as vscode from "vscode";
import { MessageInterface, SessionInterface } from "../type";

const uniqueId = function () {
    return Math.floor(Math.random() * 100000);
};

class Session implements SessionInterface {
    
    public id: number;
    
    public updateTime: Date;
    
    public promptContext: MessageInterface[];

    constructor(promptContext: MessageInterface[] = []) {
        this.id = uniqueId();
        this.updateTime = new Date();
        this.promptContext = promptContext;
    }
}

export class SessionStore {

    private static _instance: SessionStore;

    private _store: any;

    private _extensionContext: vscode.ExtensionContext;

    private _currentSession: Session | undefined;

    private constructor(extensionContext: vscode.ExtensionContext) {
        this._extensionContext = extensionContext;
        // extensionContext.workspaceState.update("session", undefined);
        const contextState: string | undefined = extensionContext.workspaceState.get("session");
                
        if (contextState && Object.keys(contextState as Object).length !== 0) {
            this._store = JSON.parse(contextState);
        } else {
            this._store = {};
            extensionContext.workspaceState.update('session', JSON.stringify(this._store));
        }
    }

    public static initInstance(extensionContext: vscode.ExtensionContext): void {
        if(!SessionStore._instance) {
            SessionStore._instance = new SessionStore(extensionContext);
        }
    }

    public static getInstance(): SessionStore {
        return SessionStore._instance;
    }
    
    public getCurrentSession(): Session {
        if(this._currentSession) {
            return this._currentSession;
        } else {
            return this.get();
        }
        
    }

    public set(key: number, value: Session): void {
        this._store[key] = value;
        this._extensionContext.workspaceState.update("session", JSON.stringify(this._store));
    }

    public clear() {
        this._store = {};
        this._extensionContext.workspaceState.update("session", undefined);
    }

    public delete(key: number): void {
        delete this._store[key];
        
        this._extensionContext.workspaceState.update("session", JSON.stringify(this._store));
    }

    public get(key?: number): Session {
        if (Object.keys(this._store).length === 0) {
            // 无会话则新建会话
            const session: Session = new Session();

            this._store[session.id] = session;
            this._currentSession = session;
        } else if (key === undefined) {
            // 不传key则默认返回最新会话
            let time = 0;
            let newKey: number = 0;
            for(const i of Object.keys(this._store)) {
                const value = this._store[i];
                if (+new Date(value.updateTime) > time) {
                    time = +new Date(value.updateTime);
                    newKey = value.id;
                }
            }
            this._currentSession = this._store[newKey] as Session;

        } else {
            this._currentSession = this._store[key] as Session;
        }
        return this._currentSession;
    }

    public pushPromptContext(sessionId: number, context: MessageInterface[]) {
        const session: Session = this.get(sessionId);

        if (session) {
            context.forEach(item => {
                session.promptContext.push(item);
            });
            session.updateTime = new Date();
            this.set(sessionId, session);
        }
    }
}
