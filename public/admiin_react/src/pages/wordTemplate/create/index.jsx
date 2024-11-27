import { useRef, lazy } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    ModalForm,
} from '@ant-design/pro-components';
import {wordTemplateApi} from '@/api/wordTemplate';
import { Button, App } from 'antd';
import { authCkeck } from '@/common/function';
import Lazyload from '@/pages/component/lazyLoad/index';

const Form1 = lazy(() => import('./../component/form1'));

export default ({ tableReload, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();
    return (
        <ModalForm
            name="createWordTemplate"
            formRef={formRef}
            title="添加word模板"
            trigger={
                <Button 
                    type="primary" 
                    disabled={authCkeck('wordTemplateCreate')} 
                    icon={<PlusOutlined />}
                >添加word模板</Button>
            }
            width={800}
            //第一个输入框获取焦点
            autoFocusFirstInput={true}
            //可以回车提交
            isKeyPressSubmit={true}
            //不干掉null跟undefined 的数据
            omitNil={false}
            onFinish={async (values) => {
                const result = await wordTemplateApi.create(values);
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
                <Form1 type="create" />
            </Lazyload>
        </ModalForm>
    );
};