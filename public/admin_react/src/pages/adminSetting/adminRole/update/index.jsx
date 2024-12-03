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
export default (props) => {
    const formRef = useRef();
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);

    useUpdateEffect(() => {
        if (props.updateId > 0) {
            setOpen(true);
        }
    }, [props.updateId])

    return (
        <ModalForm
            formRef={formRef}
            open={open}
            onOpenChange={(_boolean) => {
                setOpen(_boolean);
                // 关闭的时候干掉updateId，不然无法重复修改同一条数据
                if (_boolean === false) {
                    props.setUpdateId(0);
                }
            }}
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
                destroyOnClose: true,
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