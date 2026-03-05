import {
    ProFormText,
    ProFormTreeSelect
} from '@ant-design/pro-components';
import { arrayToTree} from '@/common/function';
import { newsClassApi } from '@/api/newsClass';

/**
 * 判断是否需要禁用掉某个分类，当修改的时候，上级不能选择自己或自己的下级
 * @param {array} list 
 * @param {int} id 当前正在修的id
 * @returns 
 */
const disabledClass = (list, id) => {
    list.map(item => {
        item.disabled = item.pid_path.indexOf(id) === -1 ? false : true;
        if (item.children) {
            disabledClass(item.children, id)
        }
    })
    return list;
}

export default ({typeAction, ...props}) => {

    return <>
        <ProFormText
            name="title"
            label="分类名称"
            placeholder="请输入"
            rules={[
                { required: true, message: '请输入' }
            ]}
        />
        <ProFormTreeSelect
            name="pid"
            label="上级分类"
            placeholder="请选择"
            rules={[
                //{ required: true, message: '请选择' }
            ]}
            request={async () => {
                const result = await newsClassApi.getList();
                let list = result.data.map(item => {
                    return {
                        value: item.id,
                        label: item.title,
                        ...item
                    }
                })
                list = arrayToTree(list, null, 'children', [], false);
                if (typeAction == 'update') {
                    list = disabledClass(list, props.updateId);
                }
                return list;
            }}
        />
    </>;
};