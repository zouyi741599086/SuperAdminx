import { lazy } from 'react';
import { newsClassApi } from '@/api/newsClass';
import { arrayToTree } from '@/common/function';
import {
    ProForm,
    ProFormText,
    ProFormTreeSelect,
    ProFormTextArea,
} from '@ant-design/pro-components';

const Teditor = lazy(() => import('@/component/form/teditor/index'));
const UploadImgAll = lazy(() => import('@/component/form/uploadImgAll/index'));

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
 * 添加修改文章的form字段
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {

    return <>
        <ProFormTreeSelect
            name="news_class_id"
            label="所属分类"
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
        <ProFormText
            name="title"
            label="标题"
            placeholder="请输入"
            rules={[
                { required: true, message: '请输入' }
            ]}
        />
        <ProFormTextArea
            name="description"
            label="文章简介"
            placeholder="请输入"
            fieldProps={{
                autoSize: {
                    minRows: 2,
                    maxRows: 6,
                }
            }}
            rules={[
            ]}
        />
        <ProForm.Item
            name="img"
            label="文章主图"
            rules={[
            ]}
        >
            <UploadImgAll maxCount={3} width={700} />
        </ProForm.Item>
        <ProForm.Item
            name="content"
            label="文章内容"
            rules={[
                { required: true, message: '请输入' }
            ]}
        >
            <Teditor />
        </ProForm.Item>
    </>
}
