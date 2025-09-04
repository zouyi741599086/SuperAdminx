import { lazy } from 'react';
import {
    ProForm,
    ProFormText,
    ProFormDigit,
} from '@ant-design/pro-components';
import Lazyload from '@/component/lazyLoad/index';

const SelectAdminRole = lazy(() => import('@/components/selectAdminRole'));

/**
 * 管理员 新增修改的form字段
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default ({ action, ...props }) => {
    return <>
        <ProFormText
            name="name"
            label="姓名"
            placeholder="请输入"
            rules={[
                { required: true, message: '请输入' }
            ]}
        />
        <ProFormDigit
            name="tel"
            label="手机号"
            placeholder="请输入"
            rules={[
                { required: true, message: '请输入' },
                { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' },
            ]}
        />
        <ProFormText
            name="username"
            label="登录帐号"
            placeholder="请输入"
            rules={[
                { required: true, message: '请输入' },
                { min: 3, message: '最小长度3位' },
            ]}
        />
        <ProFormText.Password
            name="password"
            label="登录密码"
            placeholder="请输入"
            rules={[
                { required: action === 'update' ? false : true, message: '请输入' },
                { min: 6, message: '最小长度6位' },
            ]}
            extra={action === 'update' ? '不修改密码请留空~' : ''}
        />
        <Lazyload block={false}>
            <ProForm.Item
                name="admin_role_id"
                label="所属角色"
                rules={[
                    { required: true, message: '请选择' },
                ]}
            >
                <SelectAdminRole />
            </ProForm.Item>
        </Lazyload>
    </>;
};