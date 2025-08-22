import { useRef, useState, useEffect } from 'react';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import {
    ProCard,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormDependency,
    ProFormRadio,
    ProFormDigit,
    DragSortTable,
} from '@ant-design/pro-components';
import { App, Space, Flex, Button, Affix, Row, Col, Tooltip, } from 'antd';
import {
    QuestionCircleOutlined,
} from '@ant-design/icons';
import CodeHighlight from '@/component/codeHighlight';
import './reactCreateUpdate.css'

/**
 * 生成添加修改页面
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
            for (let key in data?.react_create_update?.form_fileds_type) {
                tableColumns.some(item => {
                    if (item.Field == key) {
                        newTableColumns.push(item);
                        return true;
                    }
                })
            }
            // 把数据库中没有的 按照顺序压进去
            tableColumns.map(item => {
                if (!data?.react_create_update?.form_fileds_type?.[item.Field]) {
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

    // 表单字段类型
    const form_fileds_types = [
        {
            value: 'Text',
            label: '文本输入',
        },
        {
            value: 'Password',
            label: '密码输入',
        },
        {
            value: 'TextArea',
            label: '多行文本输入',
        },
        {
            value: 'Digit',
            label: '数字输入',
        },
        {
            value: 'DigitRange',
            label: '数字区间输入',
        },
        {
            value: 'DatePicker',
            label: '日期选择',
        },
        {
            value: 'DateTimePicker',
            label: '日期+时间选择',
        },
        {
            value: 'DateRangePicker',
            label: '日期区间选择',
        },
        {
            value: 'DateTimeRangePicker',
            label: '日期+时间区间选择',
        },
        {
            value: 'TimePicker',
            label: '时间选择',
        },
        {
            value: 'TimePickerRange',
            label: '时间区间选择',
        },
        {
            value: 'Select',
            label: '下拉',
        },
        {
            value: 'TreeSelect',
            label: '树选择',
        },
        {
            value: 'SelectTable',
            label: '异步搜索选择某个表的id',
        },
        {
            value: 'Checkbox',
            label: 'Checkbox多选',
        },
        {
            value: 'Radio',
            label: 'Radio单选',
        },
        {
            value: 'Cascader',
            label: 'Cascaderlian级联选择',
        },
        {
            value: 'Switch',
            label: 'Switch开关',
        },
        {
            value: 'province',
            label: '省选择',
        },
        {
            value: 'provinceCity',
            label: '省市选择',
        },
        {
            value: 'provinceCityArea',
            label: '省市区选择',
        },
        {
            value: 'tagArr',
            label: 'tag数组',
        },
        {
            value: 'imgTitle',
            label: '姓名+图片的数组',
        },
        {
            value: 'tencentMap',
            label: '腾讯经纬度选择',
        },
        {
            value: 'uploadFile',
            label: '上传单个文件',
        },
        {
            value: 'uploadFileAll',
            label: '上传多个文件',
        },
        {
            value: 'uploadImg',
            label: '上传单张图片',
        },
        {
            value: 'uploadImgAll',
            label: '上传多张图片',
        },
        {
            value: 'uploadImgVideoAll',
            label: '上传图片或视频',
        },
        {
            value: 'teditor',
            label: '富文本编辑器',
        },
    ];

    // 表单字段设置 前缀
    const addonBefore = (Field) => {
        return <ProFormText
            key="addonBefore"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `addonBefore`]}
            placeholder="请输入..."
            fieldProps={{
                addonBefore: '前缀',
                style: { margin: '2px 0px' },
            }}
        />
    };
    // 表单字段设置 后缀
    const addonAfter = (Field) => {
        return <ProFormText
            key="addonAfter"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `addonAfter`]}
            placeholder="请输入..."
            fieldProps={{
                addonBefore: '后缀',
                style: { margin: '2px 0px' },
            }}
        />
    };
    // 表单字段设置 验证规则
    const validateRules = (Field) => {
        return <ProFormSelect
            key="validateRules"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `validateRules`]}
            placeholder="验证规则"
            options={[
                {
                    label: '必填',
                    value: 'required',
                },
                {
                    label: 'URL链接',
                    value: 'url',
                },
                {
                    label: '邮箱',
                    value: 'email',
                },
                {
                    label: '手机号',
                    value: 'tel',
                },
                {
                    label: '最小|长度',
                    value: 'min',
                },
                {
                    label: '最大|长度',
                    value: 'max',
                },
                {
                    label: '固定长度',
                    value: 'len',
                },
            ]}
            fieldProps={{
                popupMatchSelectWidth: false,
                mode: 'multiple',
                allowClear: true,
                style: { margin: '2px 0px' },
            }}
        />
    };
    // 选择的数据来源 必填
    const dataSource = (Field) => {
        return <ProFormSelect
            key="dataSource"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `dataSource`]}
            placeholder="请选择数据来源"
            options={[
                {
                    label: '自己填写选择项',
                    value: 'options',
                },
                {
                    label: 'API请求选择项',
                    value: 'request',
                },
            ]}
            fieldProps={{
                popupMatchSelectWidth: false,
                allowClear: true,
                style: { margin: '2px 0px' },
            }}
            rules={[
                { required: true, message: '请选择' }
            ]}
        />
    };
    // 省市区选择才有，选择后是需要省市区的id，还是省市区的标题
    const provinceCityAreaValueType = (Field) => {
        return <ProFormSelect
            key="provinceCityAreaValueType"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `provinceCityAreaValueType`]}
            placeholder="选择后需要类型"
            options={[
                {
                    label: '需要标题',
                    value: 'title',
                },
                {
                    label: '需要ID',
                    value: 'id',
                },
            ]}
            fieldProps={{
                popupMatchSelectWidth: false,
                allowClear: true,
                style: { margin: '2px 0px' },
            }}
            rules={[
                { required: true, message: '请选择' }
            ]}
        />
    };
    // 下拉框的时候， select的模式
    const selectMode = (Field) => {
        return <div key="selectModeWarp">
            <ProFormSelect
                key="selectMode"
                name={['react_create_update', 'form_fields_type_config', `${Field}`, `selectMode`]}
                placeholder="是否多选"
                options={[
                    {
                        label: '多选multiple',
                        value: 'multiple',
                    },
                    {
                        label: '多选加自定义输入tags',
                        value: 'tags',
                    },
                ]}
                fieldProps={{
                    popupMatchSelectWidth: false,
                    allowClear: true,
                    style: { margin: '2px 0px' },
                }}
                rules={[
                    //{ required: true, message: '请选择' }
                ]}
            />
            <ProFormDependency key="maxCount" name={[['react_create_update', 'form_fields_type_config', `${Field}`, 'selectMode']]}>
                {({ react_create_update }) => {
                    const selectMode = react_create_update?.form_fields_type_config?.[Field]?.selectMode;
                    if (selectMode) {
                        return <ProFormDigit
                            key="maxCountNumber"
                            name={['react_create_update', 'form_fields_type_config', `${Field}`, `maxCount`]}
                            placeholder="最大选择条数"
                            min={1}
                            fieldProps={{
                                addonBefore: '最多',
                                style: { margin: '2px 0px' },
                                addonAfter: '条',
                                precision: 0,
                            }}
                            rules={[
                                //{ required: true, message: '请输入' }
                            ]}
                        />
                    }
                }}
            </ProFormDependency>
        </div>
    };
    // 树选择的时候 是否显示CheckBox
    const treeCheckable = (Field) => {
        return <ProFormSelect
            key="treeCheckable"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `treeCheckable`]}
            placeholder="显示Checkbox"
            options={[
                {
                    label: '显示Checkbox',
                    value: 'treeCheckable',
                },
            ]}
            fieldProps={{
                popupMatchSelectWidth: false,
                allowClear: true,
                style: { margin: '2px 0px' },
            }}
            rules={[
                //{ required: true, message: '请选择' }
            ]}
        />
    };
    // 级联选择的时候是否允许多选
    const cascaderMultiple = (Field) => {
        return <ProFormSelect
            key="cascaderMultiple"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `cascaderMultiple`]}
            placeholder="是否多选"
            options={[
                {
                    label: 'cascaderMultiple',
                    value: 'cascaderMultiple',
                },
            ]}
            fieldProps={{
                popupMatchSelectWidth: false,
                allowClear: true,
                style: { margin: '2px 0px' },
            }}
            rules={[
                //{ required: true, message: '请选择' }
            ]}
        />
    };
    // 当多tab标签的时候，某个字段归属于哪个标签里面
    const fieldToTab = (Field) => {
        return <ProFormDependency key="field_to_tab" name={[['react_create_update', 'card_tab_list'], ['react_create_update', 'open_type']]}>
            {({ react_create_update }) => {
                const card_tab_list = react_create_update?.card_tab_list;
                const open_type = react_create_update?.open_type;
                if (open_type == 2 && card_tab_list?.length > 0) {
                    return <ProFormSelect
                        key="field_to_tab"
                        name={['react_create_update', 'form_fields_type_config', `${Field}`, `field_to_tab`]}
                        placeholder="归属哪个tab里面"
                        fieldProps={{
                            popupMatchSelectWidth: false,
                            allowClear: true,
                            style: { margin: '2px 0px' },
                        }}
                        params={{
                            card_tab_list,
                            open_type
                        }}
                        request={async () => {
                            return card_tab_list.map((item, index) => {
                                return {
                                    label: `归属tab：${item}`,
                                    value: index + 1
                                };
                            })
                        }}
                        rules={[
                            { required: true, message: '请选择' }
                        ]}
                    />
                }
            }}
        </ProFormDependency>
    };
    // 表单字段设置 允许上传的文件后缀
    const fileSuffix = (Field) => {
        return <ProFormText
            key="fileSuffix"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `fileSuffix`]}
            placeholder="请输入"
            fieldProps={{
                addonBefore: '允许文件后缀',
                style: { margin: '2px 0px' },
                addonAfter: <Tooltip title="用英文逗号隔开如：ppt,docx">
                    <QuestionCircleOutlined />
                </Tooltip>
            }}
            rules={[
                { required: true, message: '请输入' }
            ]}
        />
    };
    // 表单字段设置 最大上传数量
    const maxUploadCount = (Field) => {
        return <ProFormDigit
            key="maxUploadCount"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `maxUploadCount`]}
            placeholder="请输入"
            fieldProps={{
                addonBefore: '最大上传数量',
                style: { margin: '2px 0px' },
                precision: 0
            }}
            min={1}
        />
    };
    // 表单字段设置 最小|长度
    const minNumber = (Field) => {
        return <ProFormDigit
            key="minNumber"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `minNumber`]}
            placeholder="请输入"
            fieldProps={{
                addonBefore: '最小|长度',
                style: { margin: '2px 0px' },
                precision: 0
            }}
            min={1}
            rules={[
                { required: true, message: '请输入' }
            ]}
        />
    };
    // 表单字段设置 最大|长度
    const maxNumber = (Field) => {
        return <ProFormDigit
            key="maxNumber"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `maxNumber`]}
            placeholder="请输入"
            fieldProps={{
                addonBefore: '最大|长度',
                style: { margin: '2px 0px' },
                precision: 0
            }}
            min={1}
            rules={[
                { required: true, message: '请输入' }
            ]}
        />
    };
    // 表单字段设置 固定长度
    const lenNumber = (Field) => {
        return <ProFormDigit
            key="lenNumber"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `lenNumber`]}
            placeholder="请输入"
            fieldProps={{
                addonBefore: '固定|长度',
                style: { margin: '2px 0px' },
                precision: 0
            }}
            min={1}
            rules={[
                { required: true, message: '请输入' }
            ]}
        />
    };
    // 设置关联字段，选择某个字段
    const dependencyField = (Field) => {
        return <ProFormSelect
            key="dependencyField"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `dependencyField`]}
            placeholder="当xx字段xx的时候才显示"
            request={async () => tableColumns}
            fieldProps={{
                popupMatchSelectWidth: false,
                allowClear: true,
                style: { margin: '2px 0px' },
                fieldNames: {
                    value: 'Field',
                    label: 'Field',
                },
                optionRender: (item) => {
                    return `关联字段：${item.label}`;
                }
            }}
            extra="关联字段：当xx字段xx的时候才显示"
            rules={[
                //{ required: true, message: '请选择' }
            ]}
        />
    };
    // 表单字段设置 数量来源表
    const dataSourceTable = (Field) => {
        return <ProFormSelect
            key="dataSourceTable"
            name={['react_create_update', 'form_fields_type_config', `${Field}`, `dataSourceTable`]}
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
                    react_create_update: {
                        ...values.react_create_update, // 只要form中的这些值
                        file_name: 'index', // 生成的文件名称
                        file_suffix: 'jsx', // 生成文件的后缀名称
                    },
                    table_name: tableName,
                    code_name: 'react_create_update', // 生成的代码名称
                }).then(res => {
                    if (res.code === 1) {
                        message.success(res.message);
                        // 保存后有生成新的代码要 设置进去
                        formRef.current.setFieldValue('react_create_code', res.data.react_create_code);
                        // 修改页面的代码
                        formRef.current.setFieldValue('react_update_code', res.data.react_update_code);
                        // 添加修改 form里面的字段 的代码，可能是多个tabs来着
                        if (res.data.react_form_code) {
                            for (let key in res.data.react_form_code) {
                                formRef.current.setFieldValue(['react_form_code', key], res.data.react_form_code[key]);
                            }
                        }
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
                            name={['react_create_update', 'open_type']}
                            label="打开类型"
                            rules={[
                                { required: true, message: '请选择' }
                            ]}
                            options={[
                                {
                                    label: '弹窗打开',
                                    value: 1,
                                },
                                {
                                    label: '新页面打开',
                                    value: 2,
                                }
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormRadio.Group
                            name={['react_create_update', 'update_page']}
                            label="是否需要更新页面"
                            rules={[
                                { required: true, message: '请选择' }
                            ]}
                            options={[
                                {
                                    label: '需要',
                                    value: 1,
                                },
                                {
                                    label: '不需要',
                                    value: 2,
                                }
                            ]}
                            extra="如简单的列表而且是可编辑的Table就不需要"
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormSelect
                            name={['react_create_update', 'row_columns_number']}
                            label="每行显示几个字段"
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
                    <ProFormDependency key="1" name={[['react_create_update', 'open_type']]}>
                        {({ react_create_update }) => {
                            const open_type = react_create_update?.open_type;
                            if (open_type == 2) {
                                return <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                                    <ProFormSelect
                                        name={['react_create_update', 'card_tab_list']}
                                        label="多标签Tab的form"
                                        placeholder="请输入"
                                        fieldProps={{
                                            mode: 'tags'
                                        }}
                                        extra="直接输入tab的名称"
                                        rules={[
                                            //{ required: true, message: '请选择' }
                                        ]}
                                    />
                                </Col>;
                            }
                        }}
                    </ProFormDependency>
                </Row>

                <DragSortTable
                    className="generator-create-update-from"
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
                            title: '表单字段类型',
                            dataIndex: 'form_fileds_type',
                            render: (_, record) => <>
                                <ProFormSelect
                                    name={['react_create_update', 'form_fileds_type', `${record.Field}`]}
                                    placeholder="请选择"
                                    request={async () => form_fileds_types}
                                    fieldProps={{
                                        showSearch: true,
                                        popupMatchSelectWidth: false,
                                    }}
                                />
                            </>
                        },
                        {
                            title: '字段配置',
                            dataIndex: 'form_fields_type_config',
                            width: 350,
                            render: (_, record) => <>
                                <ProFormDependency name={[['react_create_update', 'form_fileds_type', record.Field]]}>
                                    {({ react_create_update }) => {
                                        if (react_create_update?.form_fileds_type?.[record.Field]) {
                                            const formType = react_create_update?.form_fileds_type?.[record.Field];

                                            const _component = [];
                                            // 注入验证规则
                                            _component.push(validateRules(record.Field))

                                            // 文本框或数字才有 前缀 后缀
                                            if (formType == 'Text' || formType == 'Digit') {
                                                _component.push(addonBefore(record.Field))
                                                _component.push(addonAfter(record.Field))
                                            }

                                            // 选择的才有数据源
                                            if (['Select', 'TreeSelect', 'Checkbox', 'Radio', 'Cascader'].indexOf(formType) !== -1) {
                                                _component.push(dataSource(record.Field));

                                                // 监听数据来源 如果是api请求则选择表
                                                _component.push(<ProFormDependency key="2" name={[['react_create_update', 'form_fields_type_config', record.Field, 'dataSource']]}>
                                                    {({ react_create_update }) => {
                                                        const dataSource = react_create_update?.form_fields_type_config?.[record.Field]?.dataSource;
                                                        if (dataSource && dataSource == 'request') {
                                                            return dataSourceTable(record.Field);
                                                        }
                                                    }}
                                                </ProFormDependency>);
                                            }

                                            // 异步搜索选择某个表的id
                                            if (['SelectTable'].indexOf(formType) !== -1) {
                                                // 选择某个表
                                                _component.push(dataSourceTable(record.Field));
                                            }

                                            // 如果是上传文件才有 允许上传的文件
                                            if (['uploadFile', 'uploadFileAll'].indexOf(formType) !== -1) {
                                                _component.push(fileSuffix(record.Field))
                                            }

                                            // 如果是上传多图或多文件，才有上传的最大数量
                                            if (['uploadImgAll', 'uploadFileAll', 'uploadImgVideoAll'].indexOf(formType) !== -1) {
                                                _component.push(maxUploadCount(record.Field))
                                            }

                                            // 对验证规则设置详情参数
                                            _component.push(<ProFormDependency key="1" name={[['react_create_update', 'form_fields_type_config', record.Field, 'validateRules']]}>
                                                {({ react_create_update }) => {
                                                    const validateRules = react_create_update?.form_fields_type_config?.[record.Field]?.validateRules;
                                                    if (Array.isArray(validateRules) && validateRules.length > 0) {
                                                        const _tmp_com = [];
                                                        // 设置最小 或 最小长度
                                                        if (validateRules.indexOf('min') !== -1) {
                                                            _tmp_com.push(minNumber(record.Field));
                                                        }
                                                        // 设置最大 或 最大长度
                                                        if (validateRules.indexOf('max') !== -1) {
                                                            _tmp_com.push(maxNumber(record.Field));
                                                        }
                                                        // 设置固定长度 
                                                        if (validateRules.indexOf('len') !== -1) {
                                                            _tmp_com.push(lenNumber(record.Field));
                                                        }
                                                        return _tmp_com;
                                                    }
                                                }}
                                            </ProFormDependency>);

                                            // 下拉框才有，select是多选还是单选
                                            if (formType == 'Select') {
                                                _component.push(selectMode(record.Field));
                                            }

                                            // 树选择才有，是否显示checkbox
                                            if (formType == 'TreeSelect') {
                                                _component.push(treeCheckable(record.Field));
                                            }

                                            // 级联选择才有，是否多选
                                            if (formType == 'Cascader') {
                                                _component.push(cascaderMultiple(record.Field));
                                            }

                                            // 省市区才有，选择后需要标题还是id
                                            if (['province', 'provinceCity', 'provinceCityArea'].indexOf(formType) !== -1) {
                                                _component.push(provinceCityAreaValueType(record.Field))
                                            }

                                            // 是否是关联字段，当xx字段xx的时候必填，设置xx字段是哪个字段 
                                            _component.push(dependencyField(record.Field));

                                            // 多top的时候，归属于哪个tab
                                            _component.push(fieldToTab(record.Field));

                                            return _component;
                                        }
                                        return '';
                                    }}
                                </ProFormDependency>
                                <ProFormText
                                    name={['react_create_update', 'form_fields_type_config', `${record.Field}`, `extra`]}
                                    placeholder="字段提示信息"
                                    fieldProps={{
                                        style: { margin: '2px 0px' },
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

                <ProFormDependency name={[['react_create_update', 'update_page']]}>
                    {({ react_create_update }) => {
                        if (react_create_update?.update_page == 1) {
                            return <>
                                <Row gutter={[24, 0]}>
                                    <Col span={12}>
                                        <ProForm.Item
                                            name="react_create_code"
                                            label="新增页面代码"
                                        >
                                            <CodeHighlight/>
                                        </ProForm.Item>
                                    </Col>
                                    <Col span={12}>
                                        <ProForm.Item
                                            name="react_update_code"
                                            label="更新页面代码"
                                        >
                                            <CodeHighlight/>
                                        </ProForm.Item>
                                    </Col>
                                </Row>
                            </>
                        } else {
                            return <>
                                <ProForm.Item
                                    name="react_create_code"
                                    label="新增页面代码"
                                >
                                    <CodeHighlight/>
                                </ProForm.Item>
                            </>
                        }
                    }}
                </ProFormDependency>

                <ProFormDependency name={[['react_create_update', 'card_tab_list'], ['react_create_update', 'open_type'],]}>
                    {({ react_create_update }) => {
                        const open_type = react_create_update?.open_type;
                        const card_tab_list = react_create_update?.card_tab_list;
                        if (open_type == 2 && card_tab_list?.length > 0) {
                            return card_tab_list.map((item, index) => {
                                return <ProForm.Item
                                    key={index}
                                    name={['react_form_code', `${index + 1}`]}
                                    label={`Form字段：${item}`}
                                >
                                    <CodeHighlight/>
                                </ProForm.Item>
                            })
                        } else {
                            return <ProForm.Item
                                name={['react_form_code', `1`]}
                                label="Form字段代码"
                            >
                                <CodeHighlight/>
                            </ProForm.Item>
                        }
                    }}
                </ProFormDependency>


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
                            operationFile('react_create_update');
                        }}
                    >生成到项目</Button>
                </Flex>
            </ProCard>
        </Affix>
    </>
}
