import { App, Spin, Button } from 'antd';

/**
 * 预览pdf，移动端只支持查看pdf的第一页
 * frame的方式预览pdf
 * @param {String} title 弹窗标题
 * @param {String} url 需要预览的pdf的文件路劲，http://xxxx.com/xxx/xxx.pdf  或 /xxx/xxx.pdf
 * @param {Component} button 是否自定义查看按钮
 * @param {string} errorMessage 错误的提示语
 * @param {int} height iframe的高度
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ title = 'Pdf内容', url = null, button = null, errorMessage = '', height = 650, ...props }) => {
    const { modal, message } = App.useApp();

    const preView = () => {
        if (!url) {
            return message.error(errorMessage || 'PDF的链接为空，请稍后在试~');
        }
        modal.info({
            title: title,
            width: 1000,
            footer: null,
            closable: true,
            icon: <></>,
            maskClosable: true,
            content: <>
                <div
                    style={{
                        width: '100%',
                        height: height,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            left: '0px',
                            top: '0px',
                            zIndex: '0'
                        }}
                    >
                        <Spin tip="Loading">
                            <div style={{ width: '100%', height: height }}></div>
                        </Spin>
                    </div>
                    {/* iframe需要postion定位往左往上移动1像素，是为了遮挡它有个蓝色的边很丑 */}
                    <iframe
                        style={{ width: '100%', height: '100%', position: 'relative', left: '-1px', top: '-1px', zIndex: 1 }}
                        frameBorder="0"
                        src={`${url}`}
                        type="application/pdf"
                    ></iframe>
                </div>
            </>,
        });
    }

    if (!button) {
        return <>
            <Button
                type="link"
                size="small"
                onClick={() => {
                    preView();
                }}
            >查看</Button>
        </>
    } else {
        return <span
            onClick={() => {
                preView();
            }}
        >{button}</span>
    }
}
