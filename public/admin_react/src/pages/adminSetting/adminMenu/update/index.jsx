import { useRef, lazy, useEffect } from 'react';
import {
    ProForm,
} from '@ant-design/pro-components';
import { adminMenuApi } from '@/api/adminMenu';
import { App } from 'antd';
import Lazyload from '@/component/lazyLoad/index';

const Form1 = lazy(() => import('./../component/form1'));

/**
 * 后台菜单修改
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default (props) => {
    const { message } = App.useApp();
    const formRef = useRef();

    useEffect(() => {
        if (props.updateId.length > 0) {
            adminMenuApi.findData({
                id: props.updateId[0]
            }).then(res => {
                if (res.code === 1) {
                    formRef?.current?.setFieldsValue(res.data);
                } else {
                    message.error(res.message)
                }
            })
        }
    }, [props.updateId])
    return (<>
        <ProForm
            formRef={formRef}
            width={800}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={false}
            initialValues={{
                hidden: 1,
                sort: 0,
            }}
            onFinish={async (values) => {
                const result = await adminMenuApi.update({
                    id: props.updateId[0],
                    ...values,
                });
                if (result.code === 1) {
                    props.getList();
                    props.setUpdateId([]);
                    message.success(result.message)
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
            submitter={{
                resetButtonProps: {
                    style: {
                        // 隐藏重置按钮
                        display: 'none',
                    },
                }
            }}
        >
            <Lazyload>
                <Form1 typeAction="update" {...props} />
            </Lazyload>
        </ProForm>
    </>
    );
};