import { useRef, lazy } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    ModalForm,
} from '@ant-design/pro-components';
import { Button, App } from 'antd';
import { adminRoleApi } from '@/api/adminRole'
import { authCheck } from '@/common/function';
import Lazyload from '@/component/lazyLoad/index';

const Form1 = lazy(() => import('./../component/form1'));

/**
 * 管理员角色 新增
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default (props) => {
    const formRef = useRef();
    const { message } = App.useApp();
    return (
        <ModalForm
            formRef={formRef}
            title="添加角色"
            width={460}
            trigger={
                <Button type="primary" disabled={authCheck('adminRoleCreate')} icon={<PlusOutlined />}>
                    添加角色
                </Button>
            }
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
            onFinish={async (values) => {
                const result = await adminRoleApi.create(values);
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