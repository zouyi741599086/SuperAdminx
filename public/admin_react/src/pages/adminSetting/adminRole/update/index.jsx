import { useRef, useState, lazy } from 'react';
import {
    ModalForm,
} from '@ant-design/pro-components';
import { App } from 'antd';
import { adminRoleApi } from '@/api/adminRole'
import { useUpdateEffect } from 'ahooks';
import Lazyload from '@/component/lazyLoad/index';

const Form1 = lazy(() => import('./../component/form1'));

/**
 * 管理员角色 修改
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
const Update = ({ tableReload, updateId, setUpdateId, ...props }) => {
    const formRef = useRef();
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

    return (
        <ModalForm
            formRef={formRef}
            open={open}
            onOpenChange={handleOpenChange}
            title="修改角色"
            width={460}
            // 第一个输入框获取焦点
            autoFocusFirstInput={true}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={false}
            initialValues={{
                hidden: 1,
                sort: 0,
            }}
            modalProps={{
                // 关闭的时候销毁modal里的子元素，因为重复修改一条数据后request返回无法赋值到form里面，官方bug
                destroyOnHidden: true,
            }}
            params={{
                id: props.updateId
            }}
            request={async (params) => {
                const result = await adminRoleApi.findData(params);
                if (result.code === 1) {
                    return result.data;
                } else {
                    message.error(result.message);
                    setOpen(false);
                }
            }}
            onFinish={async (values) => {
                const result = await adminRoleApi.update({
                    id: props.updateId,
                    ...values
                });
                if (result.code === 1) {
                    props.tableReload();
                    message.success(result.message)
                    formRef.current?.resetFields?.()
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <Lazyload height={50}>
                <Form1 />
            </Lazyload>
        </ModalForm>
    );
};

export default Update;