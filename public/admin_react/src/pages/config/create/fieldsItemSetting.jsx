import { useRef, useState, lazy } from 'react';
import {
    ProForm,
    ModalForm,
    ProFormText,
    ProFormRadio,
    ProFormDigit,
    ProFormDependency,
} from '@ant-design/pro-components';
import { useUpdateEffect } from 'ahooks';
import Lazyload from '@/component/lazyLoad/index';

const TagArr = lazy(() => import('@/component/form/tagArr/index'));

export default (props) => {
    const formRef = useRef();
    const [open, setOpen] = useState(false);
    useUpdateEffect(() => {
        if (props.data?.id) {
            setOpen(true);
        }
    }, [props.data])

    return (
        <ModalForm
            name="settingFields"
            formRef={formRef}
            open={open}
            onOpenChange={(_boolean) => {
                setOpen(_boolean);
                if (_boolean === false) {
                    props.setUpdateData({});
                    formRef?.current?.resetFields();
                }
            }}
            title="设置字段参数"
            grid={true}
            initialValues={{
                required: 1
            }}
            rowProps={{
                gutter: [24, 0],
            }}
            modalProps={{
                destroyOnClose: true
            }}
            params={{
                id: props.data?.id
            }}
            request={() => {
                return props.data?.updateFields;
            }}
            colProps={{ md: 12, xs: 24 }}
            // 可以回车提交
            isKeyPressSubmit={true}
            // 不干掉null跟undefined 的数据
            omitNil={false}
            onFinish={async (values) => {
                let _data = props.data;
                _data.updateFields = values;

                // 通用的
                _data.dataIndex = values.name;
                _data.name = values.name;
                _data.title = values.title;

                _data.formItemProps.extra = values.extra;
                _data.formItemProps.rules = [];

                // 输入框的前缀 后缀
                if (['text', 'digit', 'digitRange'].indexOf(props.data.valueType) !== -1) {
                    _data.fieldProps.addonBefore = values.addonBefore;
                    _data.fieldProps.addonAfter = values.addonAfter;
                }
                // 如果必填
                if (values.required === 2) {
                    _data.formItemProps.rules.push({
                        required: true,
                        message: '必填'
                    })
                }

                ////数字的////
                if (props.data.valueType === 'digit') {
                    if (values.min !== undefined) {
                        _data.fieldProps.min = values.min;
                    }
                    if (values.max !== undefined) {
                        _data.fieldProps.max = values.max;
                    }
                }

                ////时间的////
                if (props.data.valueType === 'time') {
                    _data.fieldProps.format = 'HH:mm';
                }

                ////时间区间的////
                if (props.data.valueType === 'timeRange') {
                    _data.fieldProps.format = 'HH:mm';
                }

                ////下拉框的////
                if (props.data.valueType === 'select') {
                    _data.fieldProps.options = [];
                    if (values.mode !== 1) {
                        _data.fieldProps.mode = values.mode;
                    }
                    if (values.mode !== 'tags') {
                        //选择值
                        values.select.map(item => {
                            _data.fieldProps.options.push({
                                value: item,
                                label: item,
                            })
                        })
                    }
                }

                ////多选的////
                if (props.data.valueType === 'checkbox') {
                    _data.fieldProps.options = values.options;
                }

                ////单选的////
                if (props.data.valueType === 'radio') {
                    //选择值
                    _data.fieldProps.options = [];
                    values.options.map(item => {
                        _data.fieldProps.options.push({
                            value: item,
                            label: item,
                        })
                    })
                }

                ////单图的////
                if (props.data.valueType === 'uploadImg') {
                    if (values.width !== undefined) {
                        _data.fieldProps.width = values.width;
                    }
                    if (values.height !== undefined) {
                        _data.fieldProps.height = values.height;
                    }
                }
                ////多图的////
                if (props.data.valueType === 'uploadImgAll') {
                    if (values.width !== undefined) {
                        _data.fieldProps.width = values.width;
                    }
                    if (values.height !== undefined) {
                        _data.fieldProps.height = values.height;
                    }
                    if (values.maxCount !== undefined) {
                        _data.fieldProps.maxCount = values.maxCount;
                    }
                }

                ////单文件的的////
                if (props.data.valueType === 'uploadFile') {
                    _data.fieldProps.accept = values.accept;
                }

                ////多文件的的////
                if (props.data.valueType === 'uploadFileAll') {
                    if (values.maxCount !== undefined) {
                        _data.fieldProps.maxCount = values.maxCount;
                    }
                    // 选择值
                    _data.fieldProps.accept = values.accept ?? [];
                }

                const res = await props.updateFields(_data);
                if (res) {
                    formRef.current?.resetFields?.()
                }
                return res;
            }}
        >
            <ProFormText
                name="name"
                label="字段name"
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' }
                ]}
                extra="英文、需要整个表单唯一"
            />
            <ProFormText
                name="title"
                label="字段标题"
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' }
                ]}
            />
            <ProFormText
                name="extra"
                label="填写时候的帮助提示"
                placeholder="请输入"
            />
            <ProFormRadio.Group
                name="required"
                label="是否必填"
                options={[
                    {
                        label: '否',
                        value: 1,
                    },
                    {
                        label: '是',
                        value: 2,
                    },
                ]}
                rules={[
                    { required: true, message: '请选择' }
                ]}
            />

            {/* 数字输入框的 */}
            {props.data.valueType === 'digit' ? <>
                <ProFormDigit
                    name='min'
                    label='最小值'
                    placeholder="请输入"
                />
                <ProFormDigit
                    name='max'
                    label='最大值'
                    placeholder="请输入"
                />
            </> : ''}

            {/* 下拉框 */}
            {props.data.valueType === 'select' ? <>
                <ProFormRadio.Group
                    name="mode"
                    label="类型"
                    value={1}
                    options={[
                        {
                            label: '单选下拉',
                            value: 1,
                        },
                        {
                            label: '多选下拉',
                            value: 'multiple',
                        },
                        {
                            label: '标签输入框',
                            value: 'tags',
                        },
                    ]}
                />
                <ProFormDependency name={['mode']}>
                    {({ mode }) => {
                        if (mode !== 'tags') {
                            return (
                                <Lazyload>
                                    <ProForm.Item
                                        name='select'
                                        label='下拉框选择项'
                                        style={{ padding: '0px 12px' }}
                                        extra="输入后直接回车即可"
                                        rules={[
                                            { required: true, message: '请输入' }
                                        ]}
                                    >
                                        <TagArr />
                                    </ProForm.Item>
                                </Lazyload>
                            )
                        }
                    }}
                </ProFormDependency>

            </> : ''}

            {/* 多选的 */}
            {props.data.valueType === 'checkbox' ? <>
                <Lazyload>
                    <ProForm.Item
                        name='options'
                        label='选择项'
                        style={{ padding: '0px 12px' }}
                        extra="输入后直接回车即可"
                        rules={[
                            { required: true, message: '请输入' }
                        ]}
                    >
                        <TagArr />
                    </ProForm.Item>
                </Lazyload>
            </> : ''}

            {/* 单选的 */}
            {props.data.valueType === 'radio' ? <>
                <Lazyload>
                    <ProForm.Item
                        name='options'
                        label='选择项'
                        style={{ padding: '0px 12px' }}
                        extra="输入后直接回车即可"
                        rules={[
                            { required: true, message: '请输入' }
                        ]}
                    >
                        <TagArr />
                    </ProForm.Item>
                </Lazyload>
            </> : ''}

            {/* 单图的 */}
            {props.data.valueType === 'uploadImg' ? <>
                <ProFormDigit
                    name='width'
                    label='图片裁剪宽度'
                    placeholder="请输入"
                    min={0}
                    extra="0为不限制"
                />
                <ProFormDigit
                    name='height'
                    label='图片裁剪高度'
                    placeholder="请输入"
                    min={0}
                    extra="0为不限制"
                />
            </> : ''}

            {/* 多图的 */}
            {props.data.valueType === 'uploadImgAll' ? <>
                <ProFormDigit
                    name='width'
                    label='图片裁剪宽度'
                    placeholder="请输入"
                    min={0}
                    extra="0为不限制"
                />
                <ProFormDigit
                    name='height'
                    label='图片裁剪高度'
                    placeholder="请输入"
                    min={0}
                    extra="0为不限制"
                />
                <ProFormDigit
                    name='maxCount'
                    label='最多可上传多少张图片'
                    placeholder="请输入"
                    min={1}
                    extra="默认为10张"
                />
            </> : ''}

            {/* 单文件的 */}
            {props.data.valueType === 'uploadFile' ? <>
                <Lazyload>
                    <ProForm.Item
                        name='accept'
                        label='允许上传的文件后缀'
                        style={{ padding: '0px 12px' }}
                        extra="如docx、zip、jpg，输入后直接回车即可"
                        rules={[
                            { required: true, message: '请输入' }
                        ]}
                    >
                        <TagArr />
                    </ProForm.Item>
                </Lazyload>
            </> : ''}

            {/* 多文件的 */}
            {props.data.valueType === 'uploadFileAll' ? <>
                <ProFormDigit
                    name='maxCount'
                    label='最大上传文件数量'
                    placeholder="请输入"
                    min={1}
                    extra="默认为10"
                />
                <Lazyload>
                    <ProForm.Item
                        name='accept'
                        label='允许上传的文件后缀'
                        style={{ padding: '0px 12px' }}
                        extra="如docx、zip、jpg，输入后直接回车即可"
                        rules={[
                            { required: true, message: '请输入' }
                        ]}
                    >
                        <TagArr />
                    </ProForm.Item>
                </Lazyload>
            </> : ''}

            {/**input 的前缀 后缀 */}
            {['text', 'digit', 'digitRange'].indexOf(props.data.valueType) !== -1 ? <>
                <ProFormText
                    name="addonBefore"
                    label="输入框的前缀"
                    placeholder="请输入"
                />
                <ProFormText
                    name="addonAfter"
                    label="输入框的后缀"
                    placeholder="请输入"
                />
            </> : ''}


        </ModalForm>
    );
};