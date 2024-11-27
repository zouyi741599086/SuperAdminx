import { useRef } from 'react';
import { FormOutlined } from '@ant-design/icons';
import {
    ModalForm, ProForm,
    } from '@ant-design/pro-components';
import { Button, App } from 'antd';
import { authCkeck } from '@/common/function';
import {wordTemplateApi} from '@/api/wordTemplate';
import TencentMap from '@/pages/component/form/tencentMap/index';


export default ({ ids, tableReload, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();

    return (
        <ModalForm
            name="updatecourseclass"
            formRef={formRef}
            title="批量修改经纬度"
            trigger={
                <Button
                    type="link"
                    size='small'
                    disabled={authCkeck('wordTemplateStatus')}
                    icon={<FormOutlined />}
                >修改经纬度</Button>
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
                const result = await wordTemplateApi.updateJingweidu({
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
        
            <ProForm.Item
                name="jingweidu"
                label="经纬度"
                rules={[
                    { required: true, message: '请选择' },
                ]}
                extra=""
            >
                <TencentMap />
            </ProForm.Item>
        </ModalForm>
    );
};