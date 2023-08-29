import * as vscode from 'vscode';
import { sep } from 'path';
import { ISercive } from './IService';
import { SessionStore } from '../store/sessionStore';
export class InsertService implements ISercive {

    public static readonly type = 'insert';

    private _sessionStore: SessionStore = SessionStore.getInstance();

    private _streamUpdate: ((type: string, value: string) => void) | undefined;

    // 编程语言类型对应文件后缀
    private languageMap:any = {
        'python': ['.py'],
        'java': ['.java'],
        'c++': ['.cpp', '.cc', '.cxx'],
        'javascript': ['.js'],
        'html': ['.html'],
        'css': ['.css'],
        'php': ['.php'],
        'ruby': ['.rb'],
        'swift': ['.swift'],
        'kotlin': ['.kotlin'],
        'go': ['.go'],
        'typescript': ['.ts'],
        'c#': ['.cs'],
        'rust': ['.rs']
    };

    constructor() {
    }

    public setStreamUpdate(func: (type: string, value: string) => void): void {
        this._streamUpdate = func;
    }

    /**
     * 获取当前vscode根目录
     * @returns 
     */
    private getProjectPath() {
        return vscode.workspace.rootPath;
    }

    /**
     * 写入文件路径拼接
     * @returns 
     */
    private getGeneratorPath() {
        return `${this.getProjectPath()}${sep}`;
    }

    /**
     * 创建文件
     * @param fileRelativePath - 文件相对路径
     * @param content - 文件内容
     * @returns 
     */
    private async createFile(fileRelativePath: string, content: string) {
        if(!this.getProjectPath()) {
            vscode.window.showWarningMessage('请先打开一个工程或者文件夹');
            return;
        }
        let uri: vscode.Uri = vscode.Uri.file(this.getGeneratorPath() + sep + fileRelativePath);
        try {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(content));
            await vscode.window.showTextDocument(uri, { preview: true });
        } catch (error:any) {
            
        }
    }

    /**
     * 代码插入到当前编辑区光标所在行
     * @param content 
     */
    private insertRow(content: string) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.insertSnippet(new vscode.SnippetString(content));
        }
    }

    public run({ content, lang, insertNewFile }: { content: string, lang: string, insertNewFile: boolean }): Promise<string> {
        return new Promise((resolve, reject) => {
            if(insertNewFile) {
                const suffix = this.languageMap[lang.toLocaleLowerCase()] || '.txt';
                this.createFile(`./hexin_generator${suffix}`, content);
            } else {
                this.insertRow(content);
            }
        });
    }
}
