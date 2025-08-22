import { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import {
    ModalForm,
} from '@ant-design/pro-components';
import { Button, App, Divider, Space, } from 'antd';
import fieldsData from './fields-data';

/**
 * 订单分润结果 修改
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default ({ createFields, data, ...props }) => {
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);

    return <>
        <ModalForm
            name="createGroupItem"
            open={open}
            onOpenChange={(_boolean) => {
                setOpen(_boolean);
            }}
            title="添加分组的表单组件"
            trigger={
                <Button
                    type="dashed"
                    block
                    icon={<EditOutlined />}
                >添加表单组件</Button>
            }
            width={600}
        >
            {fieldsData.map((item) => {
                return (
                    <div key={item.title}>
                        <Divider orientation="left" key={item.title}>{item.title}</Divider>
                        <Space wrap>
                            {item.children.map((_item, _index) => {
                                // 分组里面不能在有分组
                                if (['group', 'formList'].indexOf(_item.valueType) == -1) {
                                    return <Button
                                        type="dashed"
                                        key={_index}
                                        onClick={() => {
                                            createFields(_item, data.id)
                                            setOpen(false);
                                        }}
                                    >{_item.valueTypeTitle}</Button>
                                }
                            })}
                        </Space>
                    </div>
                )
            })}
        </ModalForm>
    </>;
};