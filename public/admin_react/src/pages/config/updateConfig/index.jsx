import { useRef, useEffect, useState, lazy } from 'react';
import {
    ProForm,
    BetaSchemaForm,
    ProCard,
    PageContainer,
} from '@ant-design/pro-components';
import { configApi } from '@/api/config';
import { Alert, Skeleton, Space, App, Tooltip, Button } from 'antd';
import LazyLoad from '@/component/lazyLoad/index';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
} from '@ant-design/icons';
import MiniLink from './miniLink';

const ProConfigProvider = lazy(() => import('@/component/form/proConfigProvider/index'));

/**
 * 更新参数
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ name, ...props }) => {
    const { message } = App.useApp();
    const formRef = useRef();

    const [data, setData] = useState(false);

    useEffect(() => {
        if (!name) {
            return false;
        }
        configApi.findData({
            name
        }).then(res => {
            if (res.code === 1) {
                if (res.data.type === 'list') {
                    res.data.fields_config[0].fieldProps = {
                        // 一行显示4个字段，删除后就变为一行一个字段
                        itemContainerRender: (doms) => {
                            return <ProForm.Group>{doms}</ProForm.Group>;
                        },
                        // 最大条数
                        max: res.data.list_number,
                        // 用卡片包裹每行数据
                        itemRender: ({ listDom, action }, meta) => {
                            return (
                                <ProCard
                                    size="small"
                                    bordered
                                    hoverable
                                    extra={<>
                                        <Space>
                                            <Tooltip title="上移">
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    disabled={meta.index === 0}
                                                    onClick={() => {
                                                        meta.operation.move(meta.index, meta.index - 1);
                                                    }}
                                                ><ArrowUpOutlined /></Button>
                                            </Tooltip>
                                            <Tooltip title="下移">
                                                <Button type="link" size="small" onClick={() => {
                                                    meta.operation.move(meta.index, meta.index + 1);
                                                }}><ArrowDownOutlined /></Button>
                                            </Tooltip>
                                            {action}
                                        </Space>
                                    </>}
                                    title={`第 ${meta.index + 1} 行`}
                                    style={{
                                        marginBottom: 8,
                                    }}
                                >
                                    {listDom}
                                </ProCard>
                            );
                        }
                    }
                    // list赋值的时候多包一层
                    res.data.content = {
                        content: res.data.content
                    }
                }
                setData(res.data)
            } else {
                message.error(res.message)
            }
        })
    }, [name])

    // 重组表单的值，判断值的类型返回新值
    const fieldsDefaultValue = (data, val) => {
        let _val = val ?? null;
        // 数组
        if (!_val && ['digitRange', 'dateRange', "dateTimeRange", "timerang", "checkbox", "uploadImgAll"].indexOf(data.valueType) !== -1) {
            _val = [];
        }
        // 下拉多选跟下拉tags
        if (!_val && data.valueType === 'select' && ["multiple", "tags"].indexOf(data.fieldProps.mode) !== -1) {
            _val = [];
        }
        return _val;
    }
    return <>
        <PageContainer
            className="sa-page-container"
            ghost
            header={{
                title: data?.title || '',
                style: { padding: '0px 24px 12px' },
            }}
        >
            <ProCard
            //title={<MiniLink/>}
            >
                <Space direction='vertical' size="middle" style={{ width: '100%' }}>
                    {data !== false ? <>
                        {data.description ? <Alert message={data.description} type="info" showIcon /> : ''}
                        <LazyLoad>
                            <ProConfigProvider>
                                <BetaSchemaForm
                                    key={data.id}
                                    initialValues={data.content}
                                    formRef={formRef}
                                    columns={data.fields_config}
                                    submitter={{
                                        resetButtonProps: {
                                            style: {
                                                // 隐藏重置按钮
                                                display: 'none',
                                            },
                                        }
                                    }}
                                    grid={data.type === 'form'}
                                    colProps={{
                                        xl: 6,
                                        lg: 8,
                                        md: 12,
                                        sm: 24,
                                        xs: 24
                                    }}
                                    rowProps={{
                                        gutter: [24, 0],
                                    }}
                                    // 可以回车提交
                                    isKeyPressSubmit={true}
                                    // form的类型
                                    layoutType='Form'
                                    onFinish={async (values) => {
                                        let content = {};
                                        // 如果是form表单则重组content的值，为了让空值也保留
                                        if (data.type === 'form') {
                                            data.fields_config.map(item => {
                                                content[item['name']] = fieldsDefaultValue(item, values[item['name']]);
                                            })
                                        }
                                        if (data.type === 'list') {
                                            content = [];
                                            values.content.map((val, index) => {
                                                content[index] = {};
                                                data.fields_config[0].columns.map(item => {
                                                    content[index][item['name']] = fieldsDefaultValue(item, values['content'][index][item['name']]);
                                                })
                                            })
                                        }

                                        const result = await configApi.updateContent({
                                            id: data.id,
                                            content,
                                        });
                                        if (result.code === 1) {
                                            message.success(result.message)
                                        } else {
                                            message.error(result.message)
                                        }
                                    }}
                                />

                            </ProConfigProvider>
                        </LazyLoad>
                    </> : <>
                        <Skeleton />
                    </>}
                </Space>
            </ProCard>
        </PageContainer>
    </>;
};