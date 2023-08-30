import * as vscode from 'vscode';
import { GPT } from '../../gpt';
import { FunctionService } from '../../service/functionService';
import { MessageRoleEnum, SceneEnum } from '../../type/enums';
import { EventStore } from '../../store/eventStore';
import { SessionStore } from '../../store/sessionStore';
import { SessionInterface } from '../../type';

const _sessionStore = SessionStore.getInstance();
const _gpt = new GPT();

export class CodeExplain {
    public static readonly command = 'hipilot.code-explain';

    public static run() {
        vscode.commands.executeCommand('workbench.view.extension.chat-view');
        EventStore.emitMessage({
            target: 'chat-view',
            from: 'code-explain',
            value: {
                type: 'function',
                scene: SceneEnum.CODE_EXPLAIN
            }
        })
        
    }
}

export class CodeScan {
    public static readonly command = 'hipilot.code-scan';

    public static run() {
        vscode.commands.executeCommand('workbench.view.extension.chat-view');
        EventStore.emitMessage({
            target: 'chat-view',
            from: 'code-scan',
            value: {
                type: 'function',
                scene: SceneEnum.CODE_SCAN
            }
        })
        
    }
}

