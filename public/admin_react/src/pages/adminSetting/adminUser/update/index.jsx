import { useRef, useState, lazy, useImperativeHandle } from 'react';
import {
    ModalForm,
} from '@ant-design/pro-components';
import { App } from 'antd';
import { adminUserApi } from '@/api/adminUser';
import Lazyload from '@/component/lazyLoad/index';

const Form1 = lazy(() => import('./../component/form1'));

/**
 * 管理员 修改
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
const Update = ({ tableReload, ref, ...props }) => {
    const { message } = App.useApp();
    const formRef = useRef();
    const [open, setOpen] = useState(false);
    const [currentId, setCurrentId] = useState(0);

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
        open: (id) => {
            setCurrentId(id);
            setOpen(true);
        }
    }));

    const handleOpenChange = (visible) => {
        if (!visible) {
            setOpen(false);
            setCurrentId(0);
        }
    };

    return (
        <ModalForm
            name="updateAdminUser"
            formRef={formRef}
            open={open}
            onOpenChange={handleOpenChange}
            title="修改管理员"
            width={460}
            // 第一个输入框获取焦点
            autoFocusFirstInput={true}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            //omitNil={false}
            modalProps={{
                destroyOnHidden: true,
            }}
            params={{
                id: currentId
            }}
            request={async (params) => {
                const result = await adminUserApi.findData(params);
                if (result.code === 1) {
                    result.data.password = '';
                    return result.data;
                } else {
                    message.error(result.message);
                    setOpen(false);
                }
            }}
            onFinish={async (values) => {
                const result = await adminUserApi.update({
                    id: currentId,
                    ...values
                });
                if (result.code === 1) {
                    tableReload();
                    message.success(result.message);
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <Lazyload height={50}>
                <Form1 action='update' />
            </Lazyload>
        </ModalForm>
    );
};

export default Update;