import { useRef } from 'react';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import {
    ModalForm,
    ProFormText,
    ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Button, App } from 'antd';
import { arrayToTree, authCheck } from '@/common/function';
import { newsClassApi } from '@/api/newsClass';
import { newsApi } from '@/api/news';

// 分类数据只要有下级就要禁用
const childrenDisabled = (list) => {
    list.map(item => {
        item.disabled = item.children.length > 0 ? true : false;
        if (item.children) {
            childrenDisabled(item.children)
        }
    })
    return list;
}

/**
 * 批量复制文章
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default (props) => {
    const formRef = useRef();
    const { message } = App.useApp();

    return (
        <ModalForm
            name="NewsClass"
            formRef={formRef}
            title="批量复制"
            trigger={
                <Button
                    type="link"
                    size='small'
                    disabled={authCheck('newsCopy')}
                    icon={<CopyOutlined />}
                >批量复制</Button>
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
                const result = await newsApi.updateAll({
                    ...values,
                    ids: props.ids,
                    type: 2,//1代表批量复制
                });
                if (result.code === 1) {
                    props.tableReload(true);
                    message.success(result.message)
                    formRef.current?.resetFields?.()
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <ProFormTreeSelect
                name="news_class_id"
                label="选择分类"
                placeholder="请选择"
                rules={[
                    { required: true, message: '请选择' }
                ]}
                debounceTime={500}
                request={async () => {
                    const res = await newsClassApi.getList();
                    return arrayToTree(res.data);
                    //return childrenDisabled(arrayToTree(res.data));
                }}
                style={{ width: '100%' }}
                fieldProps={{
                    showSearch: true,
                    allowClear: true,
                    treeDefaultExpandAll: true,
                    treeNodeFilterProp: "title",
                    fieldNames: {
                        label: 'title',
                        key: 'id',
                        value: 'id'
                    }
                }}

            />
        </ModalForm>
    );
};