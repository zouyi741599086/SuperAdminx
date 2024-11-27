import { useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { useMount, } from 'ahooks';
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

/**
 * 代码编辑器
 * 
 * 修改编辑器的语言
 * monaco.editor.setModelLanguage(editor.getModel(), 'php')
 * 修改编辑器的值
 * editor.getModel().setValue('1212')
 * 获取编辑器的值
 * editor.getModel().getValue();
 * 
 * @param {string} value 代码
 * @param {onChange} onChange 值改变的时候调用的函数
 * @param {string} language 代码的语言 babel就是javascript
 * @param {readOnly} readOnly 是否只读不能编辑
 * @param {height} height 编辑器的高度
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ value, onChange, language = 'javascript', readOnly = false, height = 500, ...props }) => {
    const codeEditor = useRef();
    const [editor, setEditor] = useState();

    //value 改变的时候 改变编辑器里面的代码
    useEffect(() => {
        if (editor?.getModel?.() && editor.getModel().getValue() != value) {
            editor?.getModel?.().setValue?.(value || '');
        }
    }, [value, editor]);

    //语言改变的时候改变编辑器的语言设置
    useEffect(() => {
        if (editor?.getModel?.() && language) {
            monaco?.editor?.setModelLanguage?.(editor.getModel(), language);
        }
    }, [language, editor]);

    useMount(async () => {

        const _editor = monaco.editor.create(codeEditor.current, {
            value: value || '', // 初始代码内容
            language: language, // 'javascript'
            theme: 'vs-dark',
            readOnly: readOnly, // 是否只读
            autoIndent: true, //自动布局
            automaticLayout: true, //自动布局
            scrollBeyondLastLine: false, //高度问题，只让滚动到最后一行
            options: {
                tabSize: 4,
                insertSpaces: true,
                formatterOptions: {
                    tabSize: 4,
                    placeOpenBraceOnNewLine: true
                }
            }
            // 其他配置选项...
        });
        setEditor(_editor);

        // 监听编辑器内容的变化同时更新form的字段值
        _editor.onDidChangeModelContent(event => {
            const currentValue = _editor.getModel().getValue();
            onChange?.(currentValue);
        });
    })

    return <>
        <div style={{ width: '100%', height: height }} ref={codeEditor}></div>
    </>
}
