import { useRef } from 'react';
import { FormOutlined } from '@ant-design/icons';
import {
    ModalForm, ProForm,
    ProFormTextArea, } from '@ant-design/pro-components';
import { Button, App } from 'antd';
import { authCkeck } from '@/common/function';
import {wordTemplateApi} from '@/api/wordTemplate';


export default ({ ids, tableReload, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();

    return (
        <ModalForm
            name="updatecourseclass"
            formRef={formRef}
            title="批量修改简介"
            trigger={
                <Button
                    type="link"
                    size='small'
                    disabled={authCkeck('wordTemplateExport')}
                    icon={<FormOutlined />}
                >修改简介</Button>
            }
            width={460}
            colProps={{ md: 12, xs: 24 }}
            //第一个输入框获取焦点
            autoFocusFirstInput={true}
            //可以回车提交
            isKeyPressSubmit={true}
            //不干掉null跟undefined 的数据
            omitNil={false}
            onFinish={async (values) => {
                const result = await wordTemplateApi.updateDescription({
                    ...values,
                    ids: ids,
                });
                if (result.code === 1) {
                    tableReload();
                    message.success(result.message)
                    formRef.current?.resetFields?.()
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
        
            <ProFormTextArea
                name="description"
                label="简介"
                placeholder="请输入"
                fieldProps={{
                }}
                extra=""
                rules={[
                    { required: true, message: '请输入' },
                ]}
            />
        </ModalForm>
    );
};