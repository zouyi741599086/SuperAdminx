import { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    ModalForm,
    ProForm,
    ProFormText,
} from '@ant-design/pro-components';
import { Button, App } from 'antd';
import UploadImg from '@/component/form/uploadImg/index';

export default ({ handleCreate, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();
    return (
        <ModalForm
            name="imgTitleAdd"
            formRef={formRef}
            title="添加"
            trigger={
                <Button type="default" size="small" icon={<PlusOutlined />}>
                    添加
                </Button>
            }
            width={460}
            rowProps={{
                gutter: [24, 0],
            }}
            colProps={{ md: 12, xs: 24 }}
            // 第一个输入框获取焦点
            autoFocusFirstInput={true}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={false}
            onFinish={async (values) => {
                handleCreate(values);
                formRef.current?.resetFields?.()
                return true;
            }}
        >
            <ProFormText
                name="title"
                label="姓名"
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' }
                ]}
            />
            <ProFormText
                name="intro"
                label="角色"
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' }
                ]}
                extra="如：导演"
            />
            <ProForm.Item
                name="img"
                label="头像"
                rules={[
                    { required: true, message: '请上传' }
                ]}
            >
                <UploadImg width={300} height={450} />
            </ProForm.Item>
        </ModalForm>
    );
};