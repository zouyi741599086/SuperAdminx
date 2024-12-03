import { useRef, lazy } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    ModalForm,
} from '@ant-design/pro-components';
import { adminMenuApi } from '@/api/adminMenu';
import { Button, App } from 'antd';
import Lazyload from '@/component/lazyLoad/index';

const Form1 = lazy(() => import('./../component/form1'));

/**
 * 后台菜单新增
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default (props) => {
    const formRef = useRef();
    const { message } = App.useApp();

    return (
        <ModalForm
            formRef={formRef}
            title="添加节点"
            trigger={
                <Button type="primary" size="small" icon={<PlusOutlined />}>
                    添加节点
                </Button>
            }
            width={800}
            // 第一个输入框获取焦点
            autoFocusFirstInput={true}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={false}
            initialValues={{
                hidden: 1,
                sort: 0,
            }}
            onFinish={async (values) => {
                const result = await adminMenuApi.create(values);
                if (result.code === 1) {
                    props.getList();
                    message.success(result.message)
                    formRef.current?.resetFields?.()
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <Lazyload>
                <Form1 typeAction="create" {...props} />
            </Lazyload>
        </ModalForm>
    );
};