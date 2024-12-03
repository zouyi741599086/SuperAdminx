import { useState } from 'react';
import {
    UserOutlined,
    LoadingOutlined,
    PlusOutlined,
    TabletOutlined,
} from '@ant-design/icons';
import { App, Form, Input, Modal, Upload, InputNumber } from 'antd';
import { useBoolean } from 'ahooks'
import { adminUserApi } from '@/api/adminUser';
import { fileApi } from '@/api/file';
import { config } from '@/common/config'
import { getToken } from '@/common/function'
import { useRecoilState } from 'recoil';
import { adminUserStore } from '@/store/adminUser';
import ImgCrop from 'antd-img-crop';

export default () => {
    const [open, { toggle: toggleOpen }] = useBoolean(false);
    const [adminUser, setAdminUser] = useRecoilState(adminUserStore);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [formData, setFormData] = useState({
        img: adminUser?.img,
        name: adminUser?.name,
        tel: adminUser?.tel
    })


    // 提交
    const formSubmit = () => {
        form.validateFields().then((values) => {
            setSubmitLoading(true);
            const params = {
                ...values,
                img: formData.img
            }
            adminUserApi.updateInfo(params).then(res => {
                if (res.code === 1) {
                    message.success(res.message)
                    setAdminUser((_val) => {
                        return {
                            ..._val,
                            ...params
                        }
                    })
                    toggleOpen();
                } else {
                    message.error(res.message)
                }
                setSubmitLoading(false);
            })
        }).catch((_) => {
        });
    }
    // 头像上传前验证
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传图片~');
            return false;
        }
        if (file.size / 1024 / 1024 > config.uploadImgMax) {
            message.error(`图片大小请控制在 ${config.uploadImgMax}M 以内`);
            return false;
        }
    };

    // 头像上传的时候
    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setUploadLoading(true);
            return;
        }
        if (info.file.status === 'error') {
            message.error('上传出错~')
            setUploadLoading(false);
            return;
        }
        if (info.file.status === 'done') {
            if (info.file.response.code === 1) {
                setFormData({
                    ...formData,
                    img: info.file.response.data.avatar
                })
            } else {
                message.error('上传出错~')
            }
            setUploadLoading(false);
            return;
        }
    };

    return (
        <>
            <span onClick={toggleOpen}><UserOutlined /> 修改资料</span>

            <Modal
                open={open}
                title="修改资料"
                onCancel={toggleOpen}
                confirmLoading={submitLoading}
                onOk={formSubmit}
                width={400}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="userInfoUpdate"
                    initialValues={formData}
                >
                    <div style={{ width: '100px', margin: '0px auto' }}>
                        <ImgCrop
                            rotationSlider
                            quality={1}
                            cropShape="round" /*round*/
                            aspect={200 / 200}
                            modalProps={{
                                keyboard: true,
                                maskClosable: true,
                            }}
                        >
                            <Upload
                                name="avatar"
                                accept="image/*"
                                listType="picture-circle"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                action={fileApi.uploadUrl}
                                headers={{
                                    token: getToken()
                                }}
                                data={{
                                    width: 200,
                                    height: 200
                                }}
                            >
                                {formData.img ? (
                                    <img
                                        src={`${formData.img}`}
                                        alt="avatar"
                                        style={{
                                            width: '100%',
                                            borderRadius: '1000px'
                                        }}
                                    />
                                ) : (
                                    <div>
                                        {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>上传头像</div>
                                    </div>
                                )}
                            </Upload>
                        </ImgCrop>
                    </div>
                    <Form.Item
                        name="name"
                        label="姓名"
                        rules={[
                            { required: true, message: '请输入姓名~' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="请输入"
                        />
                    </Form.Item>
                    <Form.Item
                        name="tel"
                        label="手机号"
                        rules={[
                            { required: true, message: '请输入手机号~' },
                            { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' },
                        ]}
                    >
                        <InputNumber
                            prefix={<TabletOutlined />}
                            style={{ width: '100%' }}
                            placeholder="请输入"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
