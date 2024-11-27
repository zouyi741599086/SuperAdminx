import { App, Button, Empty, Popover } from 'antd';
import './index.css'

/**
 * 预览编辑器内容
 * 
 * @param {String} title 弹窗标题
 * @param {String} content 需要预览的编辑器内容
 * @param {Boolean} isShow 是否直接展示内容，不用弹窗
 * @param {Int} width 弹窗宽度，最大宽
 * @param {Int} type 查看方式，1》modal的弹窗查看，2》Popover气泡卡片鼠标放上去就查看
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ title = '查看内容', content = '', isShow = false, width = 800, type = 1, ...props }) => {
    const { modal } = App.useApp();
    return <>
        {isShow ? <>
            {content ? <>
                <div
                    className='previewTeditorContent'
                    dangerouslySetInnerHTML={{ __html: content }}
                ></div>
            </> : '--'}
        </> : type == 1 ? <>
            <Button type="primary" size="small" ghost onClick={() => {
                modal.info({
                    title: title,
                    width: width,
                    footer: null,
                    closable: true,
                    icon: <></>,
                    content: <>
                        {content ? <div
                            className='previewTeditorContent'
                            dangerouslySetInnerHTML={{ __html: content }}
                        ></div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无内容" />}
                    </>,
                    maskClosable: true
                });
            }}>{title}</Button>
        </> : <>
            <Popover content={content ? <div
                style={{ maxWidth: width }}
                className='previewTeditorContent'
                dangerouslySetInnerHTML={{ __html: content }}
            ></div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无内容" />}>
                <Button type="primary" size="small" ghost >查看</Button>
            </Popover>
        </>}

    </>
}
