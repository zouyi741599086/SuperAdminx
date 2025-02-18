import { useRef, useState, useEffect } from 'react';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import {
    ProTable,
    ProCard,
    ProFormList,
    ProFormSwitch,
    ProForm,
    ProFormText,
    ProFormGroup,
    ProFormSelect,
    ProFormDependency
} from '@ant-design/pro-components';
import { App, Typography, Space, Flex, Button, Affix, Row, Col } from 'antd';
import CodeHighlight from '@/component/codeHighlight';
import './model.css';

/**
 * 生成模型
 */
export default ({ tableName, operationFile, ...props }) => {
    const { message } = App.useApp();
    const tableRef = useRef();
    const formRef = useRef();

    useEffect(() => {
        if (tableName) {
            getTableColumns();
            getTableList();
            getTableColumnList();
            getMysqlConfig();
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

    // 表列表，包括每张表的所有的字段
    const [tableCloumnList, setTableCloumnList] = useState([]);
    const getTableColumnList = () => {
        adminCodeGeneratorApi.getTableColumnList().then(res => {
            if (res.code === 1) {
                setTableCloumnList(res.data);
            } else {
                message.error(res.message);
            }
        });
    }

    // 数据库的色合作
    const [mysqlConfig, setMysqlConfig] = useState(null);
    const getMysqlConfig = () => {
        adminCodeGeneratorApi.getMysqlConfig().then(res => {
            if (res.code === 1) {
                setMysqlConfig(res.data);
            } else {
                message.error(res.message);
            }
        });
    }

    // 表设置的数据，主要是表格里面要字段名称
    const [data, setData] = useState({});

    // 当所有表所有字段 及 表单的数据加载回来后，程序自动找出关联的关系自动设置到form数据里面
    useEffect(() => {
        if (tableCloumnList && data && mysqlConfig && formRef) {
            // 别个有我的id，如本表是user，则计算出user_id这个字符串
            let index = tableName.lastIndexOf(mysqlConfig.prefix);
            let tableNameKey = tableName.slice(index + mysqlConfig.prefix.length) + '_id';

            // 先找出所有的关联的表
            let formRelevance = data?.model?.relevance || [];
            tableCloumnList.map(item => {
                // 说明是本表，则就是我有别个的id
                if (item.Column.indexOf('_id') !== -1 && item.Table == tableName) {
                    // 干掉_id，找出关联的表名
                    let index = item.Column.lastIndexOf('_id');
                    let tmpTable = item.Column.slice(0, index) + item.Column.slice(index + '_id'.length);
                    tmpTable = mysqlConfig.prefix + tmpTable;
                    if (!formRelevance.find(tmp => tmp?.model == tmpTable)) {
                        formRelevance.push({
                            model: tmpTable,
                            type: 'belongsTo',
                        });
                    }
                }
                // 说明是其它表，则就是其它表有我的id
                if (item.Column == tableNameKey && item.Table != tableName) {
                    if (!formRelevance.find(tmp => tmp?.model == item.Table)) {
                        formRelevance.push({
                            model: item.Table
                        });
                    }
                }
            })
            formRef.current.setFieldValue(['model', 'relevance'], formRelevance);
        }
    }, [tableCloumnList, data, mysqlConfig, formRef])

    // 字段类型的选择项
    const types = [
        {
            value: 'json',
            label: '自动转json',
        },
        {
            value: 'integer',
            label: '整型',
        },
        {
            value: 'float',
            label: '浮点型',
        },
        {
            value: 'boolean',
            label: '布尔型',
        },
        {
            value: 'array',
            label: '自动转json',
        },
        {
            value: 'timestamp:Y-m-d',
            label: '时间戳/读的时候Y-m-d',
        },
        {
            value: 'timestamp:Y-m-d H:i',
            label: '时间戳/读的时候Y-m-d H:i',
        },
        {
            value: 'timestamp:Y-m-d H:i:s',
            label: '时间戳/读的时候Y-m-d H:i:s',
        },
    ];
    // 是否包含附件的选择
    const files = [
        {
            value: '',
            label: '等于附件路劲',
        },
        {
            value: 'array',
            label: '数组中包含附件',
        },
        {
            value: 'editor',
            label: '富文本中包含附件',
        },
    ];
    // 搜索器选择项
    const search_attrs = [
        {
            value: '',
            label: '空函数',
        },
        {
            value: '=',
            label: '等于',
        },
        {
            value: 'like',
            label: '模糊搜索',
        },
        {
            value: 'BETWEEN_TIME',
            label: '日期范围',
        },
        {
            value: '<>',
            label: '不等于',
        },
        {
            value: '>',
            label: '大于',
        },
        {
            value: '<',
            label: '小于',
        },
        {
            value: '>=',
            label: '大于等于',
        },
        {
            value: '<=',
            label: '小于等于',
        },
        {
            value: 'in',
            label: 'in搜索',
        },
        {
            value: 'not in',
            label: 'not in',
        },
        {
            value: 'between',
            label: 'between',
        },
    ];
    // 修改器选择项
    const set_attrs = [
        {
            value: '',
            label: '空函数',
        },
    ];
    // 获取器选择项
    const get_attrs = [
        {
            value: '',
            label: '空函数',
        },
    ];
    // 关联模型的关系
    const relevances = [
        {
            value: 'hasOne',
            label: '一对一|如用户有一个资料表',
        },
        {
            value: 'belongsTo',
            label: '反向一对一|如我属于某个角色',
        },
        {
            value: 'hasMany',
            label: '一对多|如文章的评论',
        },
        {
            value: 'belongsToMany',
            label: '多对多',
        },
    ];
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
            dataIndex: 'field_title',
        },
        {
            title: '字段类型',
            dataIndex: 'field_type',
            render: (_, record) => <>
                <ProFormSelect
                    name={['model', 'type', `${record.Field}`]}
                    placeholder="请选择"
                    request={async () => types}
                    fieldProps={{
                        popupMatchSelectWidth: false,
                        allowClear: true,
                        optionRender: (option) => `${option.data.label}（${option.data.value}）`
                    }}
                />
            </>
        },
        {
            title: '包含附件',
            dataIndex: 'field_file',
            render: (_, record) => <>
                <ProFormSelect
                    name={['model', 'file', `${record.Field}`]}
                    placeholder="请选择"
                    request={async () => files}
                    fieldProps={{
                        popupMatchSelectWidth: false,
                        allowClear: true,
                        optionRender: (option) => `${option.data.label}（${option.data.value}）`
                    }}
                />
            </>
        },
        {
            title: '搜索器',
            dataIndex: 'field_search_attr',
            render: (_, record) => <>
                <ProFormSelect
                    name={['model', 'search', `${record.Field}`]}
                    placeholder="请选择"
                    request={async () => search_attrs}
                    fieldProps={{
                        popupMatchSelectWidth: false,
                        allowClear: true,
                        optionRender: (option) => `${option.data.label}（${option.data.value}）`
                    }}
                />
            </>
        },
        {
            title: '修改器',
            dataIndex: 'field_set_attr',
            render: (_, record) => <>
                <ProFormSelect
                    name={['model', 'set', `${record.Field}`]}
                    placeholder="请选择"
                    request={async () => set_attrs}
                    fieldProps={{
                        popupMatchSelectWidth: false,
                        allowClear: true,
                    }}
                />
            </>
        },
        {
            title: '获取器',
            dataIndex: 'field_get_attr',
            render: (_, record) => <>
                <ProFormSelect
                    name={['model', 'get', `${record.Field}`]}
                    placeholder="请选择"
                    request={async () => get_attrs}
                    fieldProps={{
                        popupMatchSelectWidth: false,
                        allowClear: true,
                    }}
                />
            </>
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
                return result.data || {};
            }}
            submitter={false}
            onFinish={async (values) => {
                adminCodeGeneratorApi.generatorCode({
                    model: {
                        ...values.model, // 只要form中的这些值
                        file_suffix: 'php', // 生成文件的后缀名称
                    },
                    table_name: tableName,
                    code_name: 'model', // 生成的代码名称
                }).then(res => {
                    if (res.code === 1) {
                        message.success(res.message);
                        formRef.current.setFieldValue('model_code', res.data.model_code);
                    } else {
                        message.error(res.message);
                    }
                })
            }}
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Row gutter={[24, 0]}>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormText
                            name={['model', 'file_name']}
                            label="模型类名"
                            placeholder="请输入"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormText
                            name={['model', 'file_path']}
                            label="命名空间"
                            placeholder="请输入"
                            extra="模型路劲，同时也是命名空间"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormSwitch
                            name={['model', 'is_middle']}
                            label="是否是多对多中间表"
                        />
                    </Col>
                </Row>

                <ProFormList
                    name={['model', 'relevance']}
                    label="关联模型"
                    creatorButtonProps={{
                        creatorButtonText: '添加关联模型'
                    }}
                    extra="最自动找出所有的关联，需手动绑定关系，多对多则需手动添加关联模型"
                >
                    <ProFormGroup>
                        <ProFormText
                            name="title"
                            label="描述"
                            placeholder="请输入"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                            fieldProps={{
                                style: { width: 180 }
                            }}
                        />
                        <ProFormSelect
                            name="type"
                            label="关系"
                            placeholder="请选择"
                            options={relevances}
                            fieldProps={{
                                popupMatchSelectWidth: false,
                                allowClear: true,
                                style: { width: 200 }
                            }}
                            rules={[
                                { required: true, message: '请选择' }
                            ]}
                        />
                        <ProFormSelect
                            name="model"
                            label="关联模型"
                            placeholder="请选择"
                            options={tableList}
                            fieldProps={{
                                popupMatchSelectWidth: false,
                                allowClear: true,
                                showSearch: true,
                                fieldNames: {
                                    value: 'Name',
                                    label: 'Name',
                                },
                                style: { width: 180 }
                            }}
                            rules={[
                                { required: true, message: '请选择' }
                            ]}
                        />
                        {/* 多对多的时候，需要则外选择中间表 */}
                        <ProFormDependency
                            name={['type']}
                            ignoreFormListField={false} // 从全局获取关联的变量
                        >
                            {({ type }) => {
                                return <ProFormSelect
                                    name="middle"
                                    label="中间表"
                                    placeholder="请选择"
                                    disabled={type != 'belongsToMany'}
                                    options={tableList}
                                    fieldProps={{
                                        popupMatchSelectWidth: false,
                                        allowClear: true,
                                        options: tableList,
                                        fieldNames: {
                                            value: 'Name',
                                            label: 'Name',
                                        },
                                        style: { width: 180 }
                                    }}
                                    rules={[
                                        { required: type == 'belongsToMany', message: '请选择' }
                                    ]}
                                />
                            }}
                        </ProFormDependency>
                    </ProFormGroup>
                </ProFormList>

                <ProTable
                    className="generator-model"
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

                <ProForm.Item name="model_code" >
                    <CodeHighlight language='php' />
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
                            operationFile('model');
                        }}
                    >生成到项目</Button>
                </Flex>
            </ProCard>
        </Affix>
    </>
}
