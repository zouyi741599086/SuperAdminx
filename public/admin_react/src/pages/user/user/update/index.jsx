import { useRef, useState, lazy, useImperativeHandle } from 'react';
import {
    ModalForm,
} from '@ant-design/pro-components';
import { userApi } from '@/api/user';
import { App } from 'antd';
import Lazyload from '@/component/lazyLoad/index';

const Form1 = lazy(() => import('./../component/form1'));

/**
 * 用户 修改
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
const Update = ({ tableReload, ref, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState(0);

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
        open: (id) => {
            setUserId(id);
            setOpen(true);
        }
    }));

    const handleOpenChange = (visible) => {
        if (!visible) {
            setOpen(false);
            setUserId(0);
        }
    };

    return <>
        <ModalForm
            name="updateUser"
            formRef={formRef}
            open={open}
            onOpenChange={handleOpenChange}
            title="修改用户"
            width={460}
            // 第一个输入框获取焦点
            autoFocusFirstInput={true}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={false}
            modalProps={{
                destroyOnHidden: true,
            }}
            params={{
                id: userId
            }}
            request={async (params) => {
                const result = await userApi.findData(params);
                if (result.code === 1) {
                    return result.data;
                } else {
                    message.error(result.message);
                    setOpen(false);
                }
            }}
            onFinish={async (values) => {
                const result = await userApi.update({
                    id: userId,
                    ...values
                });
                if (result.code === 1) {
                    tableReload?.();
                    message.success(result.message);
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <Lazyload height={50}>
                <Form1 typeAction='update' />
            </Lazyload>
        </ModalForm>
    </>;
};

export default Update;