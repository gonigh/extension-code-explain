import * as vscode from 'vscode';

/**
 * 数组字符串转为数组
 * @param str
 * @returns
 */
export const strToArray = (str: string): string[] => {
    let array: string[] = [];
    str = str.replace(/[\[\]']+/g, '');
    str.split(',').forEach(item=>{
        array.push(item.trim());
    });
    return array;
}

/**
 * 获取选中代码 
 */
export const getSelectCode = (): string => {
    let selectedText = '';
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return '';
    }
    const selection = editor.selection;
    selectedText = editor.document.getText(selection);
    return selectedText;
}

export const getFileTyle = (): string => {
    let fileType = '';
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return '';
    }
    fileType = editor.document.languageId;
    return fileType;
}