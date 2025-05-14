import { useRef } from 'react';
import {
    ModalForm,
    ProFormText,
    ProFormDigit,
    ProFormCaptcha,
} from '@ant-design/pro-components';
//import userApi from '@/api/user';
import { App, Tooltip } from 'antd';

/**
 * 找回密码
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    const formRef = useRef();
    const { message } = App.useApp();

    return <>
        <Tooltip
            title="请联系管理员修改密码~"
        >
            <a>忘记密码？</a>
        </Tooltip>
    </>
    return <>
        <ModalForm
            name="resetPassword"
            formRef={formRef}
            title="忘记密码"
            trigger={
                <a>忘记密码？</a>
            }
            width={400}
            // 第一个输入框获取焦点
            autoFocusFirstInput={true}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={false}
            onFinish={async (values) => {
                const result = await userApi.resetPassword(values);
                if (result.code === 1) {
                    message.success(result.message)
                    formRef.current?.resetFields?.()
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <ProFormDigit
                name="tel"
                label="手机号"
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' },
                    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' },
                ]}
            />
            <ProFormCaptcha
                name="code"
                label="验证码"
                phoneName="tel"
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' },
                ]}
                onGetCaptcha={async (tel) => {
                    // 获取验证码
                    const result = await userApi.getResetPasswordCode({
                        tel,
                    });
                    if (result.code !== 1) {
                        message.error(result.message);
                        throw new Error(result.message)
                    }
                }}
            />
            <ProFormText.Password
                name="new_password"
                label="新密码"
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' },
                    { min: 6, message: '最小长度6位' },
                ]}
            />
            <ProFormText.Password
                name="confirm_password"
                label="再次输入新密码"
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' },
                    { min: 6, message: '最小长度6位' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('new_password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次密码输入不一致'));
                        },
                    })
                ]}
            />
        </ModalForm>
    </>;
};