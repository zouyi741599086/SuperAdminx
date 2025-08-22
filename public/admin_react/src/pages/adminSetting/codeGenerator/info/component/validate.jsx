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
    DragSortTable,
} from '@ant-design/pro-components';
import { App, Typography, Space, Flex, Button, Affix, Row, Col, Tooltip, Alert } from 'antd';
import {
    QuestionCircleOutlined,
} from '@ant-design/icons';
import CodeHighlight from '@/component/codeHighlight';
import './validate.css';


/**
 * 生成验证器
 */
export default ({ tableName, operationFile, ...props }) => {
    const { message } = App.useApp();
    const formRef = useRef();

    useEffect(() => {
        if (tableName) {
            getTableColumns();
        }
    }, [tableName]);

    // 字段列表
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
            for (let key in data?.validate?.field_rules) {
                tableColumns.some(item => {
                    if (item.Field == key && data?.validate?.field_rules[key].length > 0) {
                        newTableColumns.push(item);
                        return true;
                    }
                })
            }
            // 把数据库中没有的 按照顺序压进去
            tableColumns.map(item => {
                if (!data?.validate?.field_rules?.[item.Field] || data?.validate?.field_rules?.[item.Field].length == 0) {
                    newTableColumns.push(item);
                }
            })
            setTableColumns(newTableColumns);
        }
    }, [isGetData])

    // 表设置的数据，主要是表格里面要字段名称
    const [data, setData] = useState({});

    // 验证规则，错误信息有变量：字段名
    const select_rules = [
        {
            value: 'require',
            label: '必填',
            message: '请输入{file_name}',
            params: false,
            tip: '',
        },
        {
            value: 'in',
            label: '在某个范围',
            message: '请选择正确的{file_name}',
            params: true,
            tip: '如：1,2,3',
        },
        {
            value: 'confirm',
            label: '与某个字段值相等',
            message: '{file_name}必须与：',
            params: true,
            tip: '如：password',
        },
        {
            value: 'unique',
            label: '字段的值唯一',
            message: '{file_name}已存在',
            params: true,
            tip: '如：AdminUser，代表AdminUser表唯一',
        },
        {
            value: 'mobile',
            label: '有效的手机',
            message: '请输入正确的{file_name}',
            params: false,
            tip: '',
        },
        {
            value: 'idCard',
            label: '身份证',
            message: '请输入正确的身份证号',
            params: false,
            tip: '',
        },
        {
            value: 'url',
            label: 'URL地址',
            message: '{file_name}只能是有效的URL地址',
            params: false,
            tip: '',
        },
        {
            value: 'between',
            label: '某个区间',
            message: '{file_name}只能是：',
            params: true,
            tip: '如：1,10',
        },
        {
            value: 'max',
            label: '最大长度',
            message: '{file_name}最大长度为：',
            params: true,
            tip: '如：10',
        },
        {
            value: 'min',
            label: '最小长度',
            message: '{file_name}最小长度为：',
            params: true,
            tip: '如：10',
        },
        {
            value: 'length',
            label: '长度',
            message: '{file_name}长度必须是：',
            params: true,
            tip: '如：1,10；代表1到10位，如：4；代表长度位4',
        },
        {
            value: 'egt',
            label: '大于等于',
            message: '{file_name}必须大于等于',
            params: true,
            tip: '如：100',
        },
        {
            value: 'elt',
            label: '小于等于',
            message: '{file_name}必须小于等于',
            params: true,
            tip: '如：100',
        },
        {
            value: 'number',
            label: '数字',
            message: '{file_name}必须是数字',
            params: false,
            tip: '',
        },
        {
            value: 'integer',
            label: '整数',
            message: '{file_name}必须是整数',
            params: false,
            tip: '',
        },
        {
            value: 'float',
            label: '浮点数',
            message: '{file_name}必须是浮点数',
            params: false,
            tip: '',
        },
        {
            value: 'boolean',
            label: '布尔值',
            message: '请选择{file_name}',
            params: false,
            tip: '',
        },
        {
            value: 'email',
            label: '邮箱',
            message: '请填写正确的邮箱',
            params: false,
            tip: '',
        },
        {
            value: 'array',
            label: '数组',
            message: '请选择{file_name}',
            params: false,
            tip: '',
        },
        // {
        //     value: 'string',
        //     label: '字符串',
        //     message: '{file_name}必须是字符串',
        // },
        // {
        //     value: 'accepted',
        //     label: 'yes/no或1',
        //     message: '请选择{file_name}',
        // },
        {
            value: 'date',
            label: '有效日期',
            message: '{file_name}请选择正确的日期',
            params: false,
            tip: '',
        },
        {
            value: 'alpha',
            label: '纯字母',
            message: '{file_name}必须是字母',
            params: false,
            tip: '',
        },
        {
            value: 'alphaNum',
            label: '字母和数字',
            message: '{file_name}必须是字母和数字',
            params: false,
            tip: '',
        },
        // {
        //     value: 'alphaDash',
        //     label: '字母数字下划线破折号',
        //     message: '{file_name}必须是字母数字下划线_破折号-',
        // },
        // {
        //     value: 'chs',
        //     label: '汉字',
        //     message: '{file_name}必须是汉字',
        // },
        // {
        //     value: 'chsAlpha',
        //     label: '汉字加字母',
        //     message: '{file_name}必须是汉字、字母',
        // },
        // {
        //     value: 'chsAlphaNum',
        //     label: '汉字字母数字',
        //     message: '{file_name}必须是汉字、字母、数字',
        // },
        // {
        //     value: 'cntrl',
        //     label: '换行、缩进、空格',
        //     message: '{file_name}只能是换行、缩进、空格',
        // },
        // {
        //     value: 'graph',
        //     label: '可打印字符（空格除外）',
        //     message: '{file_name}只能是可打印字符（空格除外）',
        // },
        // {
        //     value: 'print',
        //     label: '可打印字符（包括空格）',
        //     message: '{file_name}只能是可打印字符（包括空格）',
        // },
        {
            value: 'lower',
            label: '小写字符',
            message: '{file_name}只能是小写字符',
            params: false,
            tip: '',
        },
        {
            value: 'upper',
            label: '大写字符',
            message: '{file_name}只能是大写字符',
            params: false,
            tip: '',
        },
        {
            value: 'xdigit',
            label: '十六进制字符串',
            message: '{file_name}只能是十六进制字符串',
            params: false,
            tip: '',
        },
        {
            value: 'activeUrl',
            label: '有效的域名或者IP',
            message: '{file_name}只能是有效的域名或者IP',
            params: false,
            tip: '',
        },

        {
            value: 'ip',
            label: 'IP地址',
            message: '{file_name}只能是有效的IP地址',
            params: false,
            tip: '',
        },
        // {
        //     value: 'dateFormat',
        //     label: '指定格式的日期',
        //     message: '{file_name}日期格式错误，必须为：',
        // },

        {
            value: 'macAddr',
            label: 'MAC地址',
            message: 'MAC地址格式错误',
            params: false,
            tip: '',
        },
        {
            value: 'zip',
            label: '邮政编码',
            message: '邮政编码格式错误',
            params: false,
            tip: '',
        },

        {
            value: 'notIn',
            label: '不在某个范围',
            message: '{file_name}不能选择：',
            params: true,
            tip: '如：1,2,3',
        },

        {
            value: 'notBetween',
            label: '不在某个区间',
            message: '{file_name}不能是：',
            params: true,
            tip: '如：1,10',
        },


        {
            value: 'after',
            label: '某个日期之后',
            message: '{file_name}必须大于：',
            params: true,
            tip: '如：2016-3-18',
        },
        {
            value: 'before',
            label: '某个日期之前',
            message: '{file_name}必须小于：',
            params: true,
            tip: '如：2016-3-18',
        },
        {
            value: 'expire',
            label: '日期之间',
            message: '{file_name}必须在：',
            params: true,
            tip: '如：2016-2-1,2016-10-01',
        },

        {
            value: 'different',
            label: '与某个字段值不相等',
            message: '{file_name}必须与：',
            params: true,
            tip: '如：password',
        },
        {
            value: 'eq',
            label: '等于',
            message: '{file_name}必须等于',
            params: true,
            tip: '如：100',
        },

        {
            value: 'lt',
            label: '小于',
            message: '{file_name}必须小于',
            params: true,
            tip: '如：100',
        },

        {
            value: 'requireIf',
            label: '当某字段等于xx的时候必须',
            message: '请输入{file_name}',
            params: true,
            tip: '如：account,1；代表account等于1的时候必须',
        },
        {
            value: 'requireWith',
            label: '当某字段有值的时候必须',
            message: '请输入{file_name}',
            params: true,
            tip: '如：account；代表account字段有值的是必填',
        },
        {
            value: 'requireWithout',
            label: '当某字段没有值的时候必须',
            message: '{file_name}必须为空',
            params: true,
            tip: '如：account；代表account字段没有值的是必填',
        },
    ];

    // 表格列
    const columns = [
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
            title: '验证规则',
            dataIndex: 'rule',
            render: (_, record) => <>
                <ProFormSelect
                    name={['validate', 'field_rules', `${record.Field}`]}
                    placeholder="请选择"
                    request={async () => select_rules}
                    fieldProps={{
                        popupMatchSelectWidth: false,
                        mode: 'multiple',
                        allowClear: true,
                        optionRender: (option) => `${option.data.label}（${option.data.value}）`
                    }}
                />
            </>
        },
        {
            title: '验证详情',
            dataIndex: 'rule_info',
            render: (_, record) => <>
                <ProFormDependency name={[['validate', 'field_rules', record.Field]]}>
                    {({ validate }) => {
                        if (Array.isArray(validate?.field_rules?.[record.Field])) {
                            // 字段选择的规则，每个规则的详情配置，如配置区间
                            let _component = validate?.field_rules?.[record.Field].map(rule_name => {
                                // 去总规则里面找，把提示、是否需要参数找出来
                                let rules_item = select_rules.find(_a => _a.value == rule_name);
                                return <ProFormText
                                    key={rule_name}
                                    name={['validate', 'field_rules_info', `${record.Field}`, `${rule_name}`]}
                                    placeholder="详细规则..."
                                    fieldProps={{
                                        addonBefore: rule_name,
                                        disabled: !rules_item.params,
                                        style: { margin: '2px 0px' },
                                        addonAfter: <Tooltip title={`${rules_item.label}${rules_item.tip ? ' ' + rules_item.tip : ''}`}>
                                            <QuestionCircleOutlined />
                                        </Tooltip>
                                    }}
                                    rules={[
                                        { required: rules_item.params, message: '请输入' }
                                    ]}
                                />
                            })
                            return _component;
                        }

                    }}
                </ProFormDependency>
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
                setIsGetData(Date.now());
                return result.data || {};
            }}
            submitter={false}
            onFinish={async (values) => {
                adminCodeGeneratorApi.generatorCode({
                    validate: {
                        ...values.validate, // 只要form中的这些值
                        file_suffix: 'php', // 生成文件的后缀名称
                    },
                    table_name: tableName,
                    code_name: 'validate', // 生成的代码名称
                }).then(res => {
                    if (res.code === 1) {
                        message.success(res.message);
                        formRef.current.setFieldValue('validate_code', res.data.validate_code);
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
                            name={['validate', 'file_name']}
                            label="验证器类名"
                            placeholder="请输入"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormText
                            name={['validate', 'file_path']}
                            label="命名空间"
                            placeholder="请输入"
                            extra="验证器路劲，同时也是命名空间"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                </Row>

                <Alert message={<>如果需要验证场景，建议将所有的字段验证规则都设置起，然后在分别添加验证场景，<b>这样在添加验证场景的时候就只会有删除某个字段的规则而不会出现添加某个字段的规则</b></>} type="warning" showIcon />
                <DragSortTable
                    className="generator-validate"
                    ghost={true}
                    rowKey="Field"
                    search={false}
                    pagination={false}
                    options={false}
                    bordered={true}
                    dragSortKey="sort"

                    columns={columns}
                    size="small"
                    // 拖动排序结束的时候
                    onDragSortEnd={(beforeIndex, afterIndex, newDataSource) => {
                        setTableColumns(newDataSource);
                    }}
                    dataSource={tableColumns}
                />

                <ProFormList
                    name={['validate', 'scenes']}
                    label="验证场景（逻辑层会自动判断是否有create、update这两个验证场景并自动加上）"
                    creatorButtonProps={{
                        creatorButtonText: '添加验证场景'
                    }}
                >
                    <ProFormGroup>
                        <ProFormText
                            name="name"
                            label="场景名称（英文且唯一）"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                            fieldProps={{
                                style: { width: 180 }
                            }}
                        />
                        <ProFormText
                            name="desc"
                            label="场景描述（如修改）"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                            fieldProps={{
                                style: { width: 180 }
                            }}
                        />
                        {/* 表单的验证规则变化的时候，同步更新场景的时候需要删除的字段规则 */}
                        <ProFormDependency
                            name={[['validate', 'field_rules']]}
                            ignoreFormListField={true} //从全局获取关联的变量
                        >
                            {({ validate }) => {
                                let tmp_select = [];
                                for (let key in validate?.field_rules) {
                                    // 字段的中文名
                                    let field_name = data.field_title?.[key] || key;
                                    // 规则英文+中文
                                    let rules_list = validate?.field_rules[key].map(rule_name => {
                                        // 去总规则里面找，把提示、是否需要参数找出来
                                        let rules_item = select_rules.find(_a => _a.value == rule_name);
                                        return {
                                            rule_name,
                                            label: rules_item.label,

                                        }
                                    })
                                    rules_list.map(item => {
                                        tmp_select.push({
                                            value: `${key}|${item.rule_name}`,
                                            label: `${field_name}：${item.label}`,
                                        })
                                    })
                                }

                                return <ProFormSelect
                                    name="delete_rules"
                                    label="要删除的规则"
                                    placeholder="请选择"
                                    params={{
                                        validate
                                    }}
                                    request={async () => {
                                        return tmp_select;
                                    }}
                                    fieldProps={{
                                        popupMatchSelectWidth: false,
                                        mode: 'multiple',
                                        allowClear: true,
                                        style: { width: 180 }
                                    }}
                                    rules={[
                                        //{ required: true, message: '请输入' }
                                    ]}
                                />
                            }}
                        </ProFormDependency>

                    </ProFormGroup>
                </ProFormList>

                <ProForm.Item name="validate_code" >
                    <CodeHighlight language='php'/>
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
                            operationFile('validate');
                        }}
                    >生成到项目</Button>
                </Flex>
            </ProCard>
        </Affix>
    </>
}
