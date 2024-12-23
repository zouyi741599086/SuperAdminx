import { useRef, useState, useEffect } from 'react';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import {
    ProCard,
    ProForm,
    ProFormSelect,
    ProFormDependency,
    DragSortTable,
    ProFormTreeSelect,
    ProFormList,
    ProFormGroup,
} from '@ant-design/pro-components';
import { App, Space, Flex, Button, Affix, Row, Col } from 'antd';
import { menuToTree } from '@/common/function';
import { adminMenuApi } from '@/api/adminMenu';
import CodeHighlight from '@/component/codeHighlight';
import './reactList.css';

/**
 * 生成列表页面
 */
export default ({ tableName, operationFile, ...props }) => {
    const { message } = App.useApp();
    const formRef = useRef();

    useEffect(() => {
        if (tableName) {
            getTableColumns();
            getMenuList();
            getTableList();
        }
    }, [tableName]);

    // 获取字段列表
    const [tableColumns, setTableColumns] = useState([]);
    const [isGetData, setIsGetData] = useState(); // 数据是否已经请求完成，需要按照数据库中的表单字段排序 对 字段列表进行重新排序
    const getTableColumns = () => {
        adminCodeGeneratorApi.getTableColumn({
            table_name: tableName
        }).then(res => {
            if (res.code === 1) {
                setTableColumns(res.data);
                setIsGetData(Date.now());
            } else {
                message.error(res.message);
            }
        });
    }

    // 需要按照数据库中的表单字段排序 对 字段列表进行重新排序
    useEffect(() => {
        if (data && tableColumns.length > 0) {
            const newTableColumns = [];
            // 把数据库有的 按照顺序压进去
            for (let key in data?.react_list?.list_fields_type) {
                tableColumns.some(item => {
                    if (item.Field == key) {
                        newTableColumns.push(item);
                        return true;
                    }
                })
            }
            // 把数据库中没有的 按照顺序压进去
            tableColumns.map(item => {
                if (!data?.react_list?.list_fields_type?.[item.Field]) {
                    newTableColumns.push(item);
                }
            })
            setTableColumns(newTableColumns);
        }
    }, [isGetData])

    // 表列表
    const [tableList, setTableList] = useState([]);
    const getTableList = () => {
        adminCodeGeneratorApi.getTableList().then(res => {
            if (res.code === 1) {
                setTableList(res.data);
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

    const [data, setData] = useState({});

    // 展示字段类型
    const list_fields_types = [
        {
            value: 'text',
            label: '常规文本',
        },
        {
            value: 'text_link',
            label: '可点击链接',
        },
        {
            value: 'image',
            label: '图片',
        },
        {
            value: 'name_tel_copy',
            label: '姓名/手机号(可复制)',
        },
        {
            value: 'name_age_sex',
            label: '姓名/年龄/性别',
        },
        {
            value: 'tag',
            label: 'Tag标签',
        },
        {
            value: 'avatar',
            label: '头像',
        },
        {
            value: 'user',
            label: '头像/姓名/手机号',
        },
        {
            value: 'money',
            label: '金额',
        },
        {
            value: 'money_line',
            label: '多行的金额',
        },
        {
            value: 'typography_text',
            label: 'Typography文字',
        },
        {
            value: 'switch',
            label: '状态开关可切换',
        },
        {
            value: 'status_type',
            label: '多颜色状态/类型',
        },

        {
            value: 'sort',
            label: '排序',
        },
        {
            value: 'progress',
            label: '进度条',
        },
        {
            value: 'descriptions',
            label: '弹窗用Descriptions描述列表',
        },
        {
            value: 'preview_text',
            label: '弹窗查看文本',
        },

        {
            value: 'preview_teditor',
            label: '预览富文本内容',
        },
        {
            value: 'preview_images_videos',
            label: '预览多图或视频',
        },
        {
            value: 'preview_video',
            label: '预览视频',
        },
        {
            value: 'preview_pdf',
            label: '预览pdf',
        },
        {
            value: 'preview_word',
            label: '预览word',
        },
        {
            value: 'create_time',
            label: '添加时间',
        },
    ];

    // 搜索的类型
    const search_type = [
        {
            label: 'Text',
            value: 'text',
        },
        {
            label: '日期区间',
            value: 'dateRange',
        },
        {
            label: '下拉',
            value: 'select',
        },
        {
            label: '树形下拉框',
            value: 'treeSelect',
        },
        {
            label: '级联选择器',
            value: 'cascader',
        },
        {
            label: '异步搜索选择某个表的id',
            value: 'selectTable',
        },
        {
            label: '选择日期',
            value: 'date',
        },
		{
            label: '省选择',
            value: 'province',
        },
        {
            label: '省市选择',
            value: 'provinceCity',
        },
        {
            label: '省市区选择',
            value: 'provinceCityArea',
        },
        {
            label: '选择日期时间',
            value: 'dateTime',
        },
        {
            label: '选择周',
            value: 'dateWeek',
        },
        {
            label: '选择月',
            value: 'dateMonth',
        },
        {
            label: '选择季度',
            value: 'dateQuarter',
        },
        {
            label: '选择年',
            value: 'dateYear',
        },

        {
            label: '日期时间区间',
            value: 'dateTimeRange',
        },
        {
            label: '选择时间',
            value: 'time',
        },
        {
            label: '时间区间',
            value: 'timeRange',
        },
        {
            label: '单选框',
            value: 'radio',
        },
        {
            label: '多选框',
            value: 'checkbox',
        },
    ];

    return <>
        <ProForm
            formRef={formRef}
            size="small"
            params={{
                table_name: tableName
            }}
            request={async (params) => {
                const result = await adminCodeGeneratorApi.getCodeGeneratorInfo(params);
                setData(result.data);
                setIsGetData(Date.now());
                return result.data || {};
            }}
            submitter={false}
            onFinish={async (values) => {
                adminCodeGeneratorApi.generatorCode({
                    react_list: {
                        ...values.react_list, // 只要form中的这些值
                        file_name: 'index', // 生成的文件名称
                        file_suffix: 'jsx', // 生成文件的后缀名称
                    },
                    table_name: tableName,
                    code_name: 'react_list', // 生成的代码名称
                }).then(res => {
                    if (res.code === 1) {
                        message.success(res.message);
                        // 保存后有生成新的代码要 设置进去
                        formRef.current.setFieldValue('react_list_code', res.data.react_list_code);
                    } else {
                        message.error(res.message);
                    }
                })
            }}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Row gutter={[24, 0]}>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormSelect
                            name={['react_list', 'table_type']}
                            label="页面类型"
                            placeholder="请选择"
                            options={[
                                {
                                    value: 1,
                                    label: '常规列表'
                                },
                                {
                                    value: 2,
                                    label: '一个字段的配置列表'
                                }
                            ]}
                            rules={[
                                { required: true, message: '请选择' }
                            ]}
                        />
                    </Col>
                    <ProFormDependency name={[['react_list', 'table_type']]}>
                        {({ react_list }) => {
                            if (react_list?.table_type == 1) {
                                return <>
                                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                                        <ProFormSelect
                                            name={['react_list', 'card_tabs_list']}
                                            label="顶部的tabs"
                                            placeholder="请输入"
                                            fieldProps={{
                                                mode: 'tags'
                                            }}
                                            rules={[
                                                //{ required: true, message: '请选择' }
                                            ]}
                                            extra="是否引入card的多Tabs，直接输入tab的名称"
                                        />
                                    </Col>
                                    <ProFormDependency name={[['react_list', 'card_tabs_list']]}>
                                        {({ react_list }) => {
                                            let card_tabs_list = react_list?.card_tabs_list;
                                            if (Array.isArray(card_tabs_list) && card_tabs_list.length > 1) {
                                                return <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                                                    <ProFormTreeSelect
                                                        name={['react_list', 'card_tabs_list_auth_id']}
                                                        label="顶部tabs的权限节点"
                                                        placeholder="请选择"
                                                        rules={[
                                                            //{ required: true, message: '请输入' }
                                                        ]}
                                                        fieldProps={{
                                                            showSearch: true,
                                                            multiple: true,
                                                            treeNodeFilterProp: 'title',
                                                            treeData: menuList,
                                                            fieldNames: {
                                                                lable: 'title',
                                                                value: 'name'
                                                            },
                                                        }}
                                                        extra="tabs的第一个不要权限，这只需按顺序选择后面几个的权限"
                                                    />
                                                </Col>
                                            }
                                        }}
                                    </ProFormDependency>
                                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                                        <ProFormSelect
                                            name={['react_list', 'table_action_list']}
                                            label="列表的操作"
                                            placeholder="请选择"
                                            fieldProps={{
                                                mode: 'multiple'
                                            }}
                                            options={[
                                                {
                                                    value: 'create',
                                                    label: '添加',
                                                },
                                                {
                                                    value: 'update',
                                                    label: '修改',
                                                },
                                                {
                                                    value: 'delete',
                                                    label: '删除',
                                                },
                                                {
                                                    value: 'info',
                                                    label: '详情',
                                                },
                                                {
                                                    value: 'export',
                                                    label: '导出',
                                                },
                                                {
                                                    value: 'import',
                                                    label: '导入',
                                                },
                                                {
                                                    value: 'all_delete',
                                                    label: '批量删除',
                                                },
                                                {
                                                    value: 'all_update_status',
                                                    label: '批量上下架(有状态修改才选择)',
                                                },
                                            ]}
                                            rules={[
                                                //{ required: true, message: '请选择' }
                                            ]}
                                        />
                                    </Col>
                                </>;
                            }
                        }}
                    </ProFormDependency>
                </Row>

                <ProFormList
                    name={['react_list', 'table_action_all_list']}
                    label="批量修改的操作"
                    creatorButtonProps={{
                        creatorButtonText: '添加批量操作'
                    }}
                    extra="要批量修改的字段，最好在表设置里面已设置中文名，然后在添加修改页面设置里面已设置表单字段类型，否则生成的字段表单会统一为Text"
                >
                    <ProFormGroup>
                        <ProFormSelect
                            name="field"
                            label="批量修改的字段"
                            placeholder="请选择"
                            options={tableColumns}
                            rules={[
                                { required: true, message: '请选择' }
                            ]}
                            fieldProps={{
                                style: { width: '200px' },
                                popupMatchSelectWidth: false,
                                fieldNames: {
                                    value: 'Field',
                                    label: 'field_title'
                                }
                            }}
                        />
                        <ProFormTreeSelect
                            name={['update_field_auth_id']}
                            label="此操作的权限节点"
                            placeholder="请选择"
                            rules={[
                                { required: true, message: '请选择' }
                            ]}
                            fieldProps={{
                                style: { width: '200px' },
                                popupMatchSelectWidth: false,
                                showSearch: true,
                                treeNodeFilterProp: 'title',
                                treeData: menuList,
                                fieldNames: {
                                    lable: 'title',
                                    value: 'name'
                                },
                            }}
                        />
                    </ProFormGroup>
                </ProFormList>

                <ProFormDependency name={[['react_list', 'table_type']]}>
                    {({ react_list }) => {
                        if (react_list?.table_type == 1) {
                            return <>
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
                                                    name={['react_list', 'list_fields_type', `${record.Field}`]}
                                                    placeholder="请选择"
                                                    request={async () => list_fields_types}
                                                    fieldProps={{
                                                        showSearch: true,
                                                        popupMatchSelectWidth: false,
                                                    }}
                                                />
                                            </>
                                        },
                                        {
                                            title: '其它配置',
                                            dataIndex: 'list_fields_type_config',
                                            render: (_, record) => <>
                                                <ProFormDependency name={[['react_list', 'list_fields_type', `${record.Field}`]]}>

                                                    {({ react_list }) => {
                                                        let _component = [];
                                                        let field_type = react_list?.list_fields_type?.[record.Field];

                                                        // 如果常规文本显示，才有自动省略、是否支持复制
                                                        if (field_type == 'text') {
                                                            _component.push(<ProFormSelect
                                                                key="ellipsis"
                                                                name={['react_list', 'list_fields_type_config', `${record.Field}`, 'ellipsis']}
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
                                                                name={['react_list', 'list_fields_type_config', `${record.Field}`, 'copyable']}
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
                                                            name={['react_list', 'list_fields_type_config', `${record.Field}`, 'sorter']}
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

                                                        // 是否支持搜索
                                                        _component.push(<ProFormSelect
                                                            key="search"
                                                            name={['react_list', 'list_fields_type_config', `${record.Field}`, 'search']}
                                                            placeholder="是否支持搜索"
                                                            rules={[
                                                                //{ required: true, message: '请选择' }
                                                            ]}
                                                            options={[
                                                                {
                                                                    value: true,
                                                                    label: '支持搜索'
                                                                },
                                                                {
                                                                    value: false,
                                                                    label: '不支持搜索'
                                                                }
                                                            ]}
                                                            fieldProps={{
                                                                style: { margin: '2px 0px' },
                                                            }}
                                                        />);

                                                        // 搜索的类型
                                                        _component.push(<ProFormDependency
                                                            key="search_dependency"
                                                            name={[['react_list', 'list_fields_type_config', `${record.Field}`, 'search']]}
                                                        >
                                                            {({ react_list }) => {
                                                                if (react_list?.list_fields_type_config?.[record.Field]?.search == true) {
                                                                    return <>
                                                                        <ProFormSelect
                                                                            key="search_type"
                                                                            name={['react_list', 'list_fields_type_config', `${record.Field}`, 'search_type']}
                                                                            placeholder="选择搜索类型"
                                                                            rules={[
                                                                                { required: true, message: '请选择' }
                                                                            ]}
                                                                            options={search_type}
                                                                            fieldProps={{
                                                                                style: { margin: '2px 0px' },
                                                                                popupMatchSelectWidth: false,
                                                                            }}
                                                                        />
                                                                        <ProFormDependency
                                                                            key="search_dependency"
                                                                            name={[['react_list', 'list_fields_type_config', `${record.Field}`, 'search_type']]}
                                                                        >
                                                                            {({ react_list }) => {
                                                                                const search_type = react_list?.list_fields_type_config?.[record.Field]?.search_type;
                                                                                if (
                                                                                    ['select', 'treeSelect', 'cascader', 'checkbox', 'radio'].indexOf(search_type) !== -1
                                                                                ) {
                                                                                    return <>
                                                                                        <ProFormSelect
                                                                                            key="search_data_type"
                                                                                            name={['react_list', 'list_fields_type_config', `${record.Field}`, 'search_data_type']}
                                                                                            placeholder="选择数据源"
                                                                                            rules={[
                                                                                                { required: true, message: '请选择' }
                                                                                            ]}
                                                                                            options={[
                                                                                                {
                                                                                                    label: '自己填写选择项',
                                                                                                    value: 1,
                                                                                                },
                                                                                                {
                                                                                                    label: 'API请求选择项',
                                                                                                    value: 2
                                                                                                }
                                                                                            ]}
                                                                                            fieldProps={{
                                                                                                style: { margin: '2px 0px' },
                                                                                                popupMatchSelectWidth: false,
                                                                                            }}
                                                                                        />
                                                                                        <ProFormDependency
                                                                                            key="search_dependency"
                                                                                            name={[['react_list', 'list_fields_type_config', `${record.Field}`, 'search_data_type']]}
                                                                                        >
                                                                                            {({ react_list }) => {
                                                                                                if (react_list?.list_fields_type_config?.[record.Field]?.search_data_type == 2) {
                                                                                                    return <ProFormSelect
                                                                                                        key="search_data_source_table"
                                                                                                        name={['react_list', 'list_fields_type_config', `${record.Field}`, `search_data_source_table`]}
                                                                                                        placeholder="请选择数据来源"
                                                                                                        options={tableList}
                                                                                                        showSearch={true}
                                                                                                        fieldProps={{
                                                                                                            popupMatchSelectWidth: false,
                                                                                                            allowClear: true,
                                                                                                            style: { margin: '2px 0px' },
                                                                                                            fieldNames: {
                                                                                                                value: 'Name',
                                                                                                                label: 'Name',
                                                                                                            },
                                                                                                        }}
                                                                                                        extra="选择项数据来源表"
                                                                                                        rules={[
                                                                                                            { required: true, message: '请选择' }
                                                                                                        ]}
                                                                                                    />
                                                                                                }
                                                                                            }}
                                                                                        </ProFormDependency>
                                                                                    </>
                                                                                }
                                                                                if (search_type == 'selectTable') {
                                                                                    return <ProFormSelect
                                                                                        key="search_data_source_table"
                                                                                        name={['react_list', 'list_fields_type_config', `${record.Field}`, `search_data_source_table`]}
                                                                                        placeholder="请选择数据来源"
                                                                                        options={tableList}
                                                                                        showSearch={true}
                                                                                        fieldProps={{
                                                                                            popupMatchSelectWidth: false,
                                                                                            allowClear: true,
                                                                                            style: { margin: '2px 0px' },
                                                                                            fieldNames: {
                                                                                                value: 'Name',
                                                                                                label: 'Name',
                                                                                            },
                                                                                        }}
                                                                                        extra="选择项数据来源表"
                                                                                        rules={[
                                                                                            { required: true, message: '请选择' }
                                                                                        ]}
                                                                                    />
                                                                                }
                                                                            }}
                                                                        </ProFormDependency>
                                                                    </>
                                                                }
                                                            }}
                                                        </ProFormDependency>);

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
                            </>;
                        }
                    }}
                </ProFormDependency>

                <ProForm.Item
                    name="react_list_code"
                >
                    <CodeHighlight/>
                </ProForm.Item>

            </Space>

        </ProForm>

        <Affix offsetBottom={10}>
            <ProCard boxShadow>
                <Flex align="center" justify="center" gap="small">
                    <Button
                        type="primary"
                        size="default"
                        onClick={() => {
                            formRef.current.submit();
                        }}
                    >保存设置》生成预览代码</Button>
                    <Button
                        danger
                        onClick={() => {
                            operationFile('react_list');
                        }}
                    >生成到项目</Button>
                </Flex>
            </ProCard>
        </Affix>
    </>
}
