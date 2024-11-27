import {
    ProFormText,
} from '@ant-design/pro-components';

/**
 * 管理员角色 新增修改的form字段
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default () => {
    return <>
        <ProFormText
            name="title"
            label="角色名称"
            placeholder="请输入"
            rules={[
                { required: true, message: '请输入' }
            ]}
        />
    </>;
};