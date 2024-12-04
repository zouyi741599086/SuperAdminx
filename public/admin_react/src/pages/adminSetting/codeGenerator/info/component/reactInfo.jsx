import { useRef, useState, useEffect } from 'react';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import {
    ProCard,
    ProFormList,
    ProForm,
    ProFormText,
    ProFormGroup,
    ProFormSelect,
    ProFormDependency,
    ProFormRadio,
    DragSortTable,
} from '@ant-design/pro-components';
import { App, Space, Flex, Button, Affix, Row, Col } from 'antd';
import CodeHighlight from '@/component/codeHighlight';
import './reactInfo.css';

/**
 * 生成详情页面 
 */
export default ({ tableName, operationFile, ...props }) => {
    const { message } = App.useApp();
    const formRef = useRef();

    useEffect(() => {
        if (tableName) {
            getTableColumns();
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
            for (let key in data?.react_info?.info_fields_type) {
                tableColumns.some(item => {
                    if (item.Field == key) {
                        newTableColumns.push(item);
                        return true;
                    }
                })
            }
            // 把数据库中没有的 按照顺序压进去
            tableColumns.map(item => {
                if (!data?.react_info?.info_fields_type?.[item.Field]) {
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

    const [data, setData] = useState({});

    // 展示字段类型
    const info_fields_types = [
        {
            value: 'text',
            label: '文本',
        },
        {
            value: 'text_ellipsis',
            label: '文本可展开',
        },
        {
            value: 'status',
            label: '状态如订单状态',
        },
        {
            value: 'text_copy',
            label: '可复制文本',
        },
        {
            value: 'text_secondary',
            label: '灰色文本',
        },
        {
            value: 'text_success',
            label: '绿色文本',
        },
        {
            value: 'text_warning',
            label: '黄色文本',
        },
        {
            value: 'text_danger',
            label: '红色文本',
        },
        {
            value: 'text_strong',
            label: '加粗文本',
        },
        {
            value: 'text_mark',
            label: '黄色底文本',
        },
        {
            value: 'text_code',
            label: '灰色底文本',
        },
        {
            value: 'preview_content',
            label: '弹窗查看文本',
        },
        {
            value: 'preview_images_videos',
            label: '预览多个图片或视频',
        },

        {
            value: 'preview_teditor',
            label: '预览富文本内容',
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
                    react_info: {
                        ...values.react_info, // 只要form中的这些值
                        file_name: 'index', // 生成的文件名称
                        file_suffix: 'jsx', // 生成文件的后缀名称
                    },
                    table_name: tableName,
                    code_name: 'react_info', // 生成的代码名称
                }).then(res => {
                    if (res.code === 1) {
                        message.success(res.message);
                        // 保存后有生成新的代码要 设置进去
                        formRef.current.setFieldValue('react_info_code', res.data.react_info_code);
                    } else {
                        message.error(res.message);
                    }
                })
            }}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Row gutter={[24, 0]}>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormRadio.Group
                            name={['react_info', 'info_open_type']}
                            label="打开类型"
                            rules={[
                                { required: true, message: '请选择' }
                            ]}
                            options={[
                                {
                                    label: '新页面打开',
                                    value: 1,
                                },
                                {
                                    label: '弹窗打开',
                                    value: 2,
                                }
                            ]}
                        />
                    </Col>
                    <ProFormDependency name={[['react_info', 'info_open_type']]}>
                        {({ react_info }) => {
                            const info_open_type = react_info?.info_open_type;
                            if (info_open_type == 2) {
                                return <>
                                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                                        <ProFormSelect
                                            name={['react_info', 'row_columns_number']}
                                            label="弹窗每行显示几个字段"
                                            placeholder="请选择"
                                            rules={[
                                                { required: true, message: '请选择' }
                                            ]}
                                            options={[
                                                {
                                                    label: '1个',
                                                    value: 1,
                                                },
                                                {
                                                    label: '2个',
                                                    value: 2,
                                                },
                                                {
                                                    label: '3个',
                                                    value: 3,
                                                },
                                                {
                                                    label: '4个',
                                                    value: 4,
                                                },
                                            ]}
                                        />
                                    </Col>
                                </>
                            }
                        }}
                    </ProFormDependency>

                    <ProFormDependency name={[['react_info', 'info_open_type']]}>
                        {({ react_info }) => {
                            const info_open_type = react_info?.info_open_type;
                            if (info_open_type == 1) {
                                return <>
                                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                                        <ProFormRadio.Group
                                            name={['react_info', 'bottom_action']}
                                            label="引入底部操作栏"
                                            rules={[
                                                //{ required: true, message: '请选择' }
                                            ]}
                                            options={[
                                                {
                                                    label: '否',
                                                    value: 1,
                                                },
                                                {
                                                    label: '是',
                                                    value: 2,
                                                }
                                            ]}
                                        />
                                    </Col>
                                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                                        <ProFormRadio.Group
                                            name={['react_info', 'right_timeline']}
                                            label="右边引入时间轴"
                                            rules={[
                                                //{ required: true, message: '请选择' }
                                            ]}
                                            options={[
                                                {
                                                    label: '否',
                                                    value: 1,
                                                },
                                                {
                                                    label: '是',
                                                    value: 2,
                                                }
                                            ]}
                                            extra="将显示在页面的右边"
                                        />
                                    </Col>
                                    <ProFormDependency name={[['react_info', 'right_timeline']]}>
                                        {({ react_info }) => {
                                            if (react_info?.right_timeline == 2) {
                                                return <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                                                    <ProFormSelect
                                                        name={['react_info', 'right_timeline_apiFileName']}
                                                        label="时间轴数据来源"
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
                                                        rules={[
                                                            { required: true, message: '请选择' }
                                                        ]}
                                                    />
                                                </Col>;
                                            }
                                        }}
                                    </ProFormDependency>
                                </>
                            }
                        }}
                    </ProFormDependency>

                </Row>
                <ProFormDependency name={[['react_info', 'info_open_type']]}>
                    {({ react_info }) => {
                        const info_open_type = react_info?.info_open_type;
                        if (info_open_type == 1) {
                            return <>
                                <ProFormList
                                    name={['react_info', 'table_list']}
                                    label="添加ProTable"
                                    creatorButtonProps={{
                                        creatorButtonText: '添加Table'
                                    }}
                                >
                                    <ProFormGroup>
                                        <ProFormText
                                            name="name"
                                            label="Table名称"
                                            placeholder="请输入"
                                            rules={[
                                                { required: true, message: '请输入' }
                                            ]}
                                            fieldProps={{
                                                style: { width: 180 }
                                            }}
                                        />
                                        <ProFormSelect
                                            name='apiFileName'
                                            label="数据请求接口"
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
                                            rules={[
                                                { required: true, message: '请选择' }
                                            ]}
                                        />
                                        <ProFormText
                                            name="apiFileName_action"
                                            label="数据请求方法名"
                                            placeholder="请输入"
                                            rules={[
                                                { required: true, message: '请输入' }
                                            ]}
                                            fieldProps={{
                                                style: { width: 180 }
                                            }}
                                        />

                                    </ProFormGroup>
                                </ProFormList>
                            </>
                        }
                    }}
                </ProFormDependency>

                <DragSortTable
                    className="generator-create-info-from"
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
                            dataIndex: 'info_fields_type',
                            render: (_, record) => <>
                                <ProFormSelect
                                    name={['react_info', 'info_fields_type', `${record.Field}`]}
                                    placeholder="请选择"
                                    request={async () => info_fields_types}
                                    fieldProps={{
                                        showSearch: true,
                                        popupMatchSelectWidth: false,
                                    }}
                                />
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

                <ProForm.Item
                    name="react_info_code"
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
                            operationFile('react_info');
                        }}
                    >生成到项目</Button>
                </Flex>
            </ProCard>
        </Affix>
    </>
}
