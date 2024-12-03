import { useRef, useState } from 'react';
import {
    ModalForm,
    ProFormText,
    ProForm,
} from '@ant-design/pro-components';
import { App, TreeSelect } from 'antd';
import { newsClassApi } from '@/api/newsClass';
import { useUpdateEffect } from 'ahooks';

/**
 * 修改文章分类
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default (props) => {
    const formRef = useRef();
    const [open, setOpen] = useState(false);
    const [classList, setClassList] = useState([]);
    const { message } = App.useApp();

    useUpdateEffect(() => {
        if (props.updateId > 0) {
            setOpen(true);
            setClassList(disabledClass([...props.list], props.updateId));
            newsClassApi.findData({
                id: props.updateId
            }).then(res => {
                if (res.code === 1) {
                    formRef?.current?.setFieldsValue(res.data);
                } else {
                    message.error(res.message)
                }
            })
        }
    }, [props.updateId])
    // 判断是否需要禁用某个分类
    const disabledClass = (list, id) => {
        list.map(item => {
            item.disabled = item.pid_path.indexOf(id) === -1 ? false : true;
            if (item.children) {
                disabledClass(item.children, id)
            }
        })
        return list;
    }

    return (
        <ModalForm
            name="updateNewsClass"
            formRef={formRef}
            open={open}
            onOpenChange={(_boolean) => {
                setOpen(_boolean);
                // 关闭的时候干掉updateId，不然无法重复修改同一条数据
                if (_boolean === false) {
                    props.setUpdateId(0);
                }
            }}
            title="修改分类"
            width={460}
            colProps={{ md: 12, xs: 24 }}
            // 第一个输入框获取焦点
            autoFocusFirstInput={true}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={true}
            onFinish={async (values) => {
                const result = await newsClassApi.update({
                    id: props.updateId,
                    pid: values.pid ?? null,
                    ...values,
                });
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
                    treeData={classList}
                />
            </ProForm.Item>
        </ModalForm>
    );
};