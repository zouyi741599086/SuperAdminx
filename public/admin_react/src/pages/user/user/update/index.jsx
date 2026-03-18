import { useRef, useState, lazy } from 'react';
import {
    ModalForm,
} from '@ant-design/pro-components';
import { userApi } from '@/api/user';
import { App } from 'antd';
import { useUpdateEffect } from 'ahooks';
import Lazyload from '@/component/lazyLoad/index';

const Form1 = lazy(() => import('./../component/form1'));

/**
 * 用户 修改
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
const Update = ({ tableReload, updateId, setUpdateId, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();
    const open = updateId > 0;

    const handleOpenChange = (_boolean) => {
        if (!_boolean) {
            Promise.resolve().then(() => {
                setUpdateId(0);
            });
        }
    };

    useUpdateEffect(() => {
        if (updateId > 0) {
            formRef.current?.resetFields?.();
        }
    }, [updateId]);

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
                id: updateId
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
                    id: updateId,
                    ...values
                });
                if (result.code === 1) {
                    tableReload?.();
                    message.success(result.message)
                    formRef.current?.resetFields?.()
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