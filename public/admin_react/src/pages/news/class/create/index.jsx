import { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    ModalForm,
    ProFormText,
    ProForm
} from '@ant-design/pro-components';
import { Button, App, TreeSelect } from 'antd';
import { authCheck } from '@/common/function';
import { newsClassApi } from '@/api/newsClass';

/**
 * 新增文章分类
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default (props) => {
    const formRef = useRef();
    const { message } = App.useApp();

    return (
        <ModalForm
            name="createNewsClass"
            formRef={formRef}
            title="添加分类"
            trigger={
                <Button
                    type="primary"
                    disabled={authCheck('newsClassCreate')}
                    icon={<PlusOutlined />}
                >添加分类</Button>
            }
            width={460}
            colProps={{ md: 12, xs: 24 }}
            // 第一个输入框获取焦点
            autoFocusFirstInput={true}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={false}
            onFinish={async (values) => {
                const result = await newsClassApi.create(values);
                if (result.code === 1) {
                    props.tableReload();
                    message.success(result.message)
                    formRef.current?.resetFields?.()
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <ProFormText
                name="title"
                label="分类名称"
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' }
                ]}
            />
            <ProForm.Item
                name="pid"
                label="上级分类"
                placeholder="请选择"
                rules={[

                ]}
                style={{ width: '100%' }}
            >
                <TreeSelect
                    placeholder="请选择"
                    showSearch={true}
                    allowClear={true}
                    treeDefaultExpandAll={true}
                    treeNodeFilterProp="title"
                    fieldNames={{
                        label: 'title',
                        key: 'id',
                        value: 'id'
                    }}
                    treeData={props.list}
                />
            </ProForm.Item>
        </ModalForm>
    );
};