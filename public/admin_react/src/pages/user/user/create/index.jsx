import { useRef, lazy } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import { userApi } from '@/api/user';
import { Button, App } from 'antd';
import { authCheck } from '@/common/function';
import Lazyload from '@/component/lazyLoad/index';

const Form1 = lazy(() => import('./../component/form1'));

/**
 * 用户 新增
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default ({ tableReload, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();
    return <>
        <ModalForm
            name="createUser"
            formRef={formRef}
            title="添加用户"
            trigger={
                <Button 
                    type="primary" 
                    disabled={authCheck('userCreate')} 
                    icon={<PlusOutlined />}
                >添加用户</Button>
            }
            width={400}
            // 第一个输入框获取焦点
            autoFocusFirstInput={true}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={false}
            onFinish={async (values) => {
                const result = await userApi.create(values);
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
                <Form1 typeAction="create" />
            </Lazyload>
        </ModalForm>
    </>;
};