import { useState } from 'react';
import {
    LockOutlined
} from '@ant-design/icons';
import { App, Form, Input, Modal } from 'antd';
import { useBoolean } from 'ahooks'
import { adminUserApi } from '@/api/adminUser';
import { storage } from '@/common/function'
import { useRecoilState } from 'recoil';
import { adminUserStore } from '@/store/adminUser';
import { useNavigate } from 'react-router-dom';

export default () => {
    const [open, { toggle: toggleOpen }] = useBoolean(false);
    const [adminUser, setAdminUser] = useRecoilState(adminUserStore);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const navigate = useNavigate();

    // 提交
    const formSubmit = () => {
        form.validateFields().then((values) => {
            setSubmitLoading(true);
            adminUserApi.updatePassword(values).then(res => {
                if (res.code === 1) {
                    message.success(res.message)
                    storage.remove('adminUserToken');
                    sessionStorage.removeItem(`adminUserToken`);
                    setAdminUser({})
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000)
                    toggleOpen();
                } else {
                    message.error(res.message)
                }
                setSubmitLoading(false);
            })
        }).catch((_) => {
        });
    }

    return (
        <>
            <span onClick={toggleOpen}><LockOutlined /> 修改密码</span>

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
                    name="userInfoPassword"
                >
                    <Form.Item
                        name="password"
                        label="原密码"
                        rules={[
                            { required: true, message: '请输入原密码~' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="请输入原密码"
                        />
                    </Form.Item>
                    <Form.Item
                        name="new_password"
                        label="新密码"
                        rules={[
                            { required: true, message: '请输入新密码' },
                            { min: 6, message: '密码长度6-16位' },
                            { max: 16, message: '密码长度6-16位' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="请输入6-16位新密码"
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirm_password"
                        label="再次输入"
                        rules={[
                            { required: true, message: '请再次输入新密码' },
                            { min: 6, message: '密码长度6-16位' },
                            { max: 16, message: '密码长度6-16位' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="请输入6-16位新密码"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
