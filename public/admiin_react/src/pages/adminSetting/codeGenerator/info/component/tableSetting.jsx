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

    //字段列表
    const [tableColumns, setTableColumns] = useState([]);
    useEffect(() => {
        if (tableName) {
            getTableColumns();
            getMenuList();
        }
    }, [tableName]);

    //获取字段数据
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

    //菜单列表 嵌套数组
    const [menuList, setMenuList] = useState([]);
    const getMenuList = () => {
        adminMenuApi.getList({
            hidden: 'all'
        }).then(res => {
            if (res.code === 1) {
                //多维数组
                setMenuList(menuToTree(res.data))
            }
        })
    }

    //表格列
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
                        <ProFormTreeSelect
                            name={['auth_ids', 'auth_list_id']}
                            label="列表页的权限节点"
                            placeholder="请选择"
                            rules={[
                                //{ required: true, message: '请输入' }
                            ]}

                            fieldProps={{
                                showSearch: true,
                                treeNodeFilterProp: 'title',
                                treeData: menuList,
                                fieldNames: {
                                    lable: 'title',
                                    value: 'name'
                                },
                            }}
                            extra="返回上一页的地址，生成目录从这个节点读"
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormTreeSelect
                            name={['auth_ids', 'auth_create_id']}
                            label="添加的权限节点"
                            placeholder="请选择"
                            rules={[
                                //{ required: true, message: '请输入' }
                            ]}

                            fieldProps={{
                                showSearch: true,
                                treeNodeFilterProp: 'title',
                                treeData: menuList,
                                fieldNames: {
                                    lable: 'title',
                                    value: 'name'
                                },
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormTreeSelect
                            name={['auth_ids', 'auth_update_id']}
                            label="修改的权限节点"
                            placeholder="请选择"
                            rules={[
                                //{ required: true, message: '请输入' }
                            ]}

                            fieldProps={{
                                showSearch: true,
                                treeNodeFilterProp: 'title',
                                treeData: menuList,
                                fieldNames: {
                                    lable: 'title',
                                    value: 'name'
                                },
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormTreeSelect
                            name={['auth_ids', 'auth_delete_id']}
                            label="删除的权限节点"
                            placeholder="请选择"
                            rules={[
                                //{ required: true, message: '请输入' }
                            ]}

                            fieldProps={{
                                showSearch: true,
                                treeNodeFilterProp: 'title',
                                treeData: menuList,
                                fieldNames: {
                                    lable: 'title',
                                    value: 'name'
                                },
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormTreeSelect
                            name={['auth_ids', 'auth_info_id']}
                            label="查看详情的权限节点"
                            placeholder="请选择"
                            rules={[
                                //{ required: true, message: '请输入' }
                            ]}

                            fieldProps={{
                                showSearch: true,
                                treeNodeFilterProp: 'title',
                                treeData: menuList,
                                fieldNames: {
                                    lable: 'title',
                                    value: 'name'
                                },
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormTreeSelect
                            name={['auth_ids', 'auth_export_id']}
                            label="导出的权限节点"
                            placeholder="请选择"
                            rules={[
                                //{ required: true, message: '请输入' }
                            ]}

                            fieldProps={{
                                showSearch: true,
                                treeNodeFilterProp: 'title',
                                treeData: menuList,
                                fieldNames: {
                                    lable: 'title',
                                    value: 'name'
                                },
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormTreeSelect
                            name={['auth_ids', 'auth_import_id']}
                            label="导入的权限节点"
                            placeholder="请选择"
                            rules={[
                                //{ required: true, message: '请输入' }
                            ]}

                            fieldProps={{
                                showSearch: true,
                                treeNodeFilterProp: 'title',
                                treeData: menuList,
                                fieldNames: {
                                    lable: 'title',
                                    value: 'name'
                                },
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormTreeSelect
                            name={['auth_ids', 'auth_update_status_id']}
                            label="状态修改的权限节点"
                            placeholder="请选择"
                            rules={[
                                //{ required: true, message: '请输入' }
                            ]}

                            fieldProps={{
                                showSearch: true,
                                treeNodeFilterProp: 'title',
                                treeData: menuList,
                                fieldNames: {
                                    lable: 'title',
                                    value: 'name'
                                },
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormTreeSelect
                            name={['auth_ids', 'auth_update_sort_id']}
                            label="修改排序的权限节点"
                            placeholder="请选择"
                            rules={[
                                //{ required: true, message: '请输入' }
                            ]}

                            fieldProps={{
                                showSearch: true,
                                treeNodeFilterProp: 'title',
                                treeData: menuList,
                                fieldNames: {
                                    lable: 'title',
                                    value: 'name'
                                },
                            }}
                        />
                    </Col>
                </Row>

                <CreateTableField callback={(params) => {
                    console.log(params);
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
