import { App, Spin, Button } from 'antd';
import { config } from '@/common/config';

/**
 * frame的方式预览word
 * 
 * @param {String} title 弹窗标题
 * @param {String} url 需要预览的word的文件路劲，http://xxxx.com/xxx/xxx.docx  或 /xxx/xxx.docx
 * @param {Component} button 是否自定义查看按钮
 * @param {String} errorMessage 错误的提示语
 * @param {int} height iframe的高度
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ title = 'Word内容', url = null, button = null, errorMessage = null, height = 650, ...props }) => {
    const { modal, message } = App.useApp();

    const preView = () => {
        if (!url) {
            return message.error(errorMessage || 'Word的链接为空，请稍后在试~');
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
                        src={`//view.officeapps.live.com/op/embed.aspx?src=${url.includes('//') ? url : config.url + url}`}
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
