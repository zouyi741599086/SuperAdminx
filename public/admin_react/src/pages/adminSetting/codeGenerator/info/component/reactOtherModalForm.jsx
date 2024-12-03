import { useState, useEffect } from 'react';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import {
    ProFormText,
    ProFormSelect,
    ProFormDependency,
    ProFormDigit,
    DragSortTable,
    ProFormTreeSelect,
} from '@ant-design/pro-components';
import { App, Row, Col, Tooltip } from 'antd';
import { menuToTree } from '@/common/function';
import { adminMenuApi } from '@/api/adminMenu';
import {
    QuestionCircleOutlined,
} from '@ant-design/icons';
import './reactOtherModalForm.css'

/**
 * 弹窗form
 */
export default ({ tableName, ...props }) => {
    const { message } = App.useApp();

    useEffect(() => {
        if (tableName) {
            getTableColumns();
            getTableList();
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
            name={['react_other', 'form_fields_type_config', `${Field}`, `addonBefore`]}
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
            name={['react_other', 'form_fields_type_config', `${Field}`, `addonAfter`]}
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
            name={['react_other', 'form_fields_type_config', `${Field}`, `validateRules`]}
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
            name={['react_other', 'form_fields_type_config', `${Field}`, `dataSource`]}
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
            name={['react_other', 'form_fields_type_config', `${Field}`, `provinceCityAreaValueType`]}
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
                name={['react_other', 'form_fields_type_config', `${Field}`, `selectMode`]}
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
            <ProFormDependency key="maxCount" name={[['react_other', 'form_fields_type_config', `${Field}`, 'selectMode']]}>
                {({ react_other }) => {
                    const selectMode = react_other?.form_fields_type_config?.[Field]?.selectMode;
                    if (selectMode) {
                        return <ProFormDigit
                            key="maxCountNumber"
                            name={['react_other', 'form_fields_type_config', `${Field}`, `maxCount`]}
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
            name={['react_other', 'form_fields_type_config', `${Field}`, `treeCheckable`]}
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
            name={['react_other', 'form_fields_type_config', `${Field}`, `cascaderMultiple`]}
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
    // 表单字段设置 允许上传的文件后缀
    const fileSuffix = (Field) => {
        return <ProFormText
            key="fileSuffix"
            name={['react_other', 'form_fields_type_config', `${Field}`, `fileSuffix`]}
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
            name={['react_other', 'form_fields_type_config', `${Field}`, `maxUploadCount`]}
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
            name={['react_other', 'form_fields_type_config', `${Field}`, `minNumber`]}
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
            name={['react_other', 'form_fields_type_config', `${Field}`, `maxNumber`]}
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
            name={['react_other', 'form_fields_type_config', `${Field}`, `lenNumber`]}
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
            name={['react_other', 'form_fields_type_config', `${Field}`, `dependencyField`]}
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
    // 表单字段设置 数据来源于哪个表
    const dataSourceTable = (Field) => {
        return <ProFormSelect
            key="dataSourceTable"
            name={['react_other', 'form_fields_type_config', `${Field}`, `dataSourceTable`]}
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

        <Row gutter={[24, 0]}>
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <ProFormSelect
                    name={['react_other', 'modal_form_row_columns_number']}
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
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <ProFormText
                    name={['react_other', 'modal_form_file_path']}
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
                    name={['react_other', 'modal_form_file_name']}
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
                    name={['react_other', 'modal_form_auth_id']}
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
                    name={['react_other', 'modal_form_title']}
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
                    name={['react_other', 'modal_form_api_name']}
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
                            name={['react_other', 'form_fileds_type', `${record.Field}`]}
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
                        <ProFormDependency name={[['react_other', 'form_fileds_type', record.Field]]}>
                            {({ react_other }) => {
                                if (react_other?.form_fileds_type?.[record.Field]) {
                                    const formType = react_other?.form_fileds_type?.[record.Field];

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
                                        _component.push(<ProFormDependency key="2" name={[['react_other', 'form_fields_type_config', record.Field, 'dataSource']]}>
                                            {({ react_other }) => {
                                                const dataSource = react_other?.form_fields_type_config?.[record.Field]?.dataSource;
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
                                    _component.push(<ProFormDependency key="1" name={[['react_other', 'form_fields_type_config', record.Field, 'validateRules']]}>
                                        {({ react_other }) => {
                                            const validateRules = react_other?.form_fields_type_config?.[record.Field]?.validateRules;
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

                                    return _component;
                                }
                                return '';
                            }}
                        </ProFormDependency>
                        <ProFormText
                            name={['react_other', 'form_fields_type_config', `${record.Field}`, `extra`]}
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
    </>
}
