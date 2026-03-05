import { useState, useEffect } from 'react';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import {
    ProFormText,
    ProFormSelect,
    ProFormDependency,
    DragSortTable,
    ProFormTreeSelect,
} from '@ant-design/pro-components';
import { App, Row, Col, } from 'antd';
import { menuToTree } from '@/common/function';
import { adminMenuApi } from '@/api/adminMenu';
import listFieldsTypes from './../component/listFieldsTypes'
import './modalTable.css';

/**
 * 生成弹窗列表
 */
export default ({ tableName, ...props }) => {
    const { message } = App.useApp();

    useEffect(() => {
        if (tableName) {
            getTableColumns();
            getMenuList();
        }
    }, [tableName]);

    // 获取字段列表
    const [tableColumns, setTableColumns] = useState([]);
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
            hidden: 1
        }).then(res => {
            if (res.code === 1) {
                // 多维数组
                setMenuList(menuToTree(res.data))
            }
        })
    }



    return <>

        <Row gutter={[24, 0]}>
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <ProFormText
                    name={['react_other', 'modal_table_file_path']}
                    label="生成的目录"
                    placeholder="请输入"
                    rules={[
                        { required: true, message: '请输入' }
                    ]}
                    extra="从public开始写，如：public/admin_react/src/xxxx"
                />
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <ProFormText
                    name={['react_other', 'modal_table_file_name']}
                    label="生成的文件名称"
                    placeholder="请输入"
                    rules={[
                        { required: true, message: '请输入' }
                    ]}
                    extra="要带后缀"
                />
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <ProFormTreeSelect
                    name={['react_other', 'modal_table_auth_id']}
                    label="操作权限"
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
                <ProFormText
                    name={['react_other', 'modal_table_title']}
                    label="弹窗标题"
                    placeholder="请输入"
                    rules={[
                        { required: true, message: '请输入' }
                    ]}
                    extra="如：修改分类"
                />
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <ProFormText
                    name={['react_other', 'modal_table_api_name']}
                    label="接口方法名称"
                    placeholder="请输入"
                    rules={[
                        { required: true, message: '请输入' }
                    ]}
                    extra="如：updateClass"
                />
            </Col>
        </Row>

        <DragSortTable
            className="generator-create-list-from"
            ghost={true}
            columns={[
                {
                    title: '排序',
                    dataIndex: 'sort',
                    width: 50,
                },
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
                    dataIndex: 'field_title',
                },
                {
                    title: '字段展示类型',
                    dataIndex: 'list_fields_type',
                    render: (_, record) => <>
                        <ProFormSelect
                            name={['react_other', 'list_fields_type', `${record.Field}`]}
                            placeholder="请选择"
                            request={async () => listFieldsTypes}
                            fieldProps={{
                                showSearch: true,
                            }}
                        />
                    </>
                },
                {
                    title: '其它配置',
                    dataIndex: 'list_fields_type_config',
                    render: (_, record) => <>
                        <ProFormDependency name={[['react_other', 'list_fields_type', `${record.Field}`]]}>

                            {({ react_other }) => {
                                let _component = [];
                                let field_type = react_other?.list_fields_type?.[record.Field];

                                // 如果常规文本显示，才有自动省略、是否支持复制
                                if (field_type == 'text') {
                                    _component.push(<ProFormSelect
                                        key="ellipsis"
                                        name={['react_other', 'list_fields_type_config', `${record.Field}`, 'ellipsis']}
                                        placeholder="是否自动省略"
                                        rules={[
                                            //{ required: true, message: '请选择' }
                                        ]}
                                        options={[
                                            {
                                                value: true,
                                                label: '自动省略'
                                            },
                                            {
                                                value: false,
                                                label: '不自动省略'
                                            }
                                        ]}
                                        fieldProps={{
                                            style: { margin: '2px 0px' },
                                        }}
                                    />);

                                    _component.push(<ProFormSelect
                                        key="copyable"
                                        name={['react_other', 'list_fields_type_config', `${record.Field}`, 'copyable']}
                                        placeholder="是否支持复制"
                                        rules={[
                                            //{ required: true, message: '请选择' }
                                        ]}
                                        options={[
                                            {
                                                value: true,
                                                label: '支持复制'
                                            },
                                            {
                                                value: false,
                                                label: '不支持复制'
                                            }
                                        ]}
                                        fieldProps={{
                                            style: { margin: '2px 0px' },
                                        }}
                                    />);
                                }

                                _component.push(<ProFormSelect
                                    key="sorter"
                                    name={['react_other', 'list_fields_type_config', `${record.Field}`, 'sorter']}
                                    placeholder="是否支持排序"
                                    rules={[
                                        //{ required: true, message: '请选择' }
                                    ]}
                                    options={[
                                        {
                                            value: true,
                                            label: '支持排序'
                                        },
                                        {
                                            value: false,
                                            label: '不支持排序'
                                        }
                                    ]}
                                    fieldProps={{
                                        style: { margin: '2px 0px' },
                                    }}
                                />);

                                return _component;

                            }}

                        </ProFormDependency>
                    </>
                },
            ]}
            rowKey="Field"
            search={false}
            pagination={false}
            options={false}
            defaultSize="small"
            bordered={true}
            dragSortKey="sort"
            // 拖动排序结束的时候
            onDragSortEnd={(beforeIndex, afterIndex, newDataSource) => {
                setTableColumns(newDataSource);
            }}
            dataSource={tableColumns}
        />

    </>
}
