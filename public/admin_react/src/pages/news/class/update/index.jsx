import { useRef, useState, lazy, useImperativeHandle } from 'react';
import {
    ModalForm,
} from '@ant-design/pro-components';
import { App } from 'antd';
import { newsClassApi } from '@/api/newsClass';
import Lazyload from '@/component/lazyLoad/index';

const Form1 = lazy(() => import('./../component/form1'));

/**
 * 修改文章分类
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
const Update = ({ tableReload, ref, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [currentId, setCurrentId] = useState(0);

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
        open: (id) => {
            setCurrentId(id);
            setOpen(true);
        }
    }));

    const handleOpenChange = (visible) => {
        if (!visible) {
            setOpen(false);
            setCurrentId(0);
        }
    };

    return (
        <ModalForm
            name="updateNewsClass"
            formRef={formRef}
            open={open}
            onOpenChange={handleOpenChange}
            title="修改分类"
            width={460}
            colProps={{ md: 12, xs: 24 }}
            // 第一个输入框获取焦点
            autoFocusFirstInput={true}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={true}
            modalProps={{
                destroyOnHidden: true,
            }}
            params={{
                id: currentId
            }}
            request={async (params) => {
                const result = await newsClassApi.findData(params);
                if (result.code === 1) {
                    return result.data;
                } else {
                    message.error(result.message);
                    setOpen(false);
                }
            }}
            onFinish={async (values) => {
                const result = await newsClassApi.update({
                    id: currentId,
                    pid: values.pid ?? null,
                    ...values,
                });
                if (result.code === 1) {
                    tableReload();
                    message.success(result.message)
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <Lazyload block={false}>
                <Form1 typeAction="update" updateId={currentId} />
            </Lazyload>
        </ModalForm>
    );
};

export default Update;