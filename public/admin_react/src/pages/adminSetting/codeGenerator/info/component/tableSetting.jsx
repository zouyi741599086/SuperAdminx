import { useRef, useState, useEffect } from 'react';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import { adminMenuApi } from '@/api/adminMenu';
import { ProTable, ProCard, ProForm, ProFormText, ProFormTreeSelect } from '@ant-design/pro-components';
import { App, Typography, Alert, Space, Affix, Flex, Button, Row, Col } from 'antd';
import { menuToTree } from '@/common/function';
import CreateTableField from './createTableField';
import './tableSetting.css';

/**
 * 表格的列
 */
export default ({ tableName, ...props }) => {
    const { message } = App.useApp();
    const tableRef = useRef();
    const formRef = useRef();

    // 字段列表
    const [tableColumns, setTableColumns] = useState([]);
    useEffect(() => {
        if (tableName) {
            getTableColumns();
            getMenuList();
        }
    }, [tableName]);

    // 获取字段数据
    const getTableColumns = () => {
        adminCodeGeneratorApi.getTableColumn({
            table_name: tableName
        }).then(res => {
            if (res.code === 1) {
                setTableColumns(res.data);
            } else {
                message.error(res.message);
            }
        });
    }

    // 菜单列表 嵌套数组
    const [menuList, setMenuList] = useState([]);
    const getMenuList = () => {
        adminMenuApi.getList({
            hidden: 'all'
        }).then(res => {
            if (res.code === 1) {
                // 多维数组
                setMenuList(menuToTree(res.data))
            }
        })
    }

    // 表格列
    const columns = [
        {
            title: '字段',
            width: 200,
            dataIndex: 'Field',
        },
        {
            title: '类型',
            width: 120,
            dataIndex: 'Type',
        },
        {
            title: '允许为空',
            dataIndex: 'Null',
            width: 80,
            render: (_, record) => record.Null == 'NO' ? <Typography.Text type="danger">否</Typography.Text> : <Typography.Text type="success">是</Typography.Text>,
        },
        {
            title: '默认值',
            dataIndex: 'Default',
            width: 70,
            render: (_, record) => record.Default ? record.Default : record.Default === null ? 'null' : '',
        },
        {
            title: '注释',
            dataIndex: 'Comment',
            ellipsis: true,
        },
        {
            title: '字段名称',
            dataIndex: 'rule',
            render: (_, record) => <>
                <ProFormText
                    name={['field_title', `${record.Field}`]}
                    placeholder="请输入"
                />
            </>
        },
        {
            title: '操作',
            dataIndex: 'action',
            width: 70,
            render: (_, record, index) => {
                if (record.delete == 1) {
                    return <Button
                        type="link"
                        size="small"
                        danger
                        onClick={() => {
                            setTableColumns(tableColumns.filter(function (item) {
                                return item.Field !== record.Field;
                            }));
                        }}
                    >删除</Button>
                }
                return '--';
            }
        },
    ];
    return <>
        <ProForm
            formRef={formRef}
            submitter={false}
            size="small"
            params={{
                table_name: tableName
            }}
            initialValues={{
                table_path: 'app\\'
            }}
            request={async (params) => {
                const result = await adminCodeGeneratorApi.getCodeGeneratorInfo(params);
                return result.data || {};
            }}
            onFinish={async (values) => {
                adminCodeGeneratorApi.updateCodeGenerator({
                    ...values,
                    table_name: tableName
                }).then(res => {
                    if (res.code === 1) {
                        message.success(res.message);
                    } else {
                        message.error(res.message);
                    }
                })
            }}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Alert message="先设置表的公共信息，后面所有操作都要用到~" type="warning" showIcon />
                <Row gutter={[24, 0]}>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormText
                            name='table_title'
                            label="表名称"
                            placeholder="请输入"
                            extra="表的中文名称，类的注释使用"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormText
                            name='table_path'
                            label="生成目录"
                            placeholder="请输入"
                            extra="模型等生成的目录，只写前缀就行如 app\ 或 plugin\shop\app\"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                </Row>

                <CreateTableField callback={(params) => {
                    if (tableColumns.some(item => item.Field == params.Field)) {
                        message.error('此字段已经存在~');
                        return false;
                    }
                    setTableColumns([
                        ...tableColumns,
                        {
                            ...params,
                            delete: 1,
                        },
                    ])
                    return true;
                }} />
                <ProTable
                    className="generator-tableColumn"
                    actionRef={tableRef}
                    rowKey="Field"
                    columns={columns}
                    pagination={false}
                    options={false}
                    search={false}
                    bordered={true}
                    size="small"
                    dataSource={tableColumns}
                />

                <Affix offsetBottom={10}>
                    <ProCard boxShadow>
                        <Flex align="center" justify="center" gap="small">
                            <Button
                                size="default"
                                type="primary"
                                onClick={() => {
                                    formRef.current.submit();
                                }}
                            >保存设置</Button>
                        </Flex>
                    </ProCard>
                </Affix>
            </Space>
        </ProForm>
    </>
}
