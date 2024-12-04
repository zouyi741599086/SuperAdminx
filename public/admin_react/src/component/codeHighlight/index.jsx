import { Typography } from 'antd';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('php', php);

/**
 * 代码高亮，展示代码的
 * 
 * @param {string} value 代码
 * @param {onChange} onChange 值改变的时候调用的函数
 * @param {height} height 编辑器的高度
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ value, language = 'jsx', height = 500, ...props }) => {

    return <>
        <div
            style={{
                width: '100%',
                maxHeight: height,
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxHeight: height,
                    overflowY: 'auto',
                    position: 'relative',
                }}
            >
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    showLineNumbers={true}
                >{value}</SyntaxHighlighter>
            </div>
            <div
                style={{
                    display: 'inline-block',
                    position: 'absolute',
                    right: 10,
                    top: 15
                }}
            >
                <Typography.Paragraph
                    copyable={{
                        text: value,
                    }}
                ></Typography.Paragraph>
            </div>
        </div>
    </>
}
