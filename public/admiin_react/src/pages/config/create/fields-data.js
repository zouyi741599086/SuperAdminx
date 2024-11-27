const formFields = [
    {
        title: '文本',
        children: [
            {
                valueType: 'text',
                valueTypeTitle: '文本',
            },
            {
                valueType: 'textarea',
                valueTypeTitle: '多行文本',
            },
            {
                valueType: 'password',
                valueTypeTitle: '密码框',
            },
        ]
    },
    {
        title: '数字',
        children: [
            {
                valueType: 'digit',
                valueTypeTitle: '数字',
            },
            {
                valueType: 'digitRange',
                valueTypeTitle: '数字范围输入',
            },
        ]
    },
    {
        title: '日期',
        children: [
            {
                valueType: 'date',
                valueTypeTitle: '日期选择',
            },
            {
                valueType: 'dateTime',
                valueTypeTitle: '日期+时间',
            },
            {
                valueType: 'dateRange',
                valueTypeTitle: '日期区间',
            },
            {
                valueType: 'dateTimeRange',
                valueTypeTitle: '日期+时间区间',
            },
        ]
    },
    {
        title: '时间',
        children: [
            {
                valueType: 'time',
                valueTypeTitle: '时间选择',
            },
            {
                valueType: 'timeRange',
                valueTypeTitle: '时间区间',
            },
        ]
    },
    {
        title: '选择类',
        children: [
            {
                valueType: 'select',
                valueTypeTitle: '下拉选择',
            },
            {
                valueType: 'checkbox',
                valueTypeTitle: '多选',
            },
            {
                valueType: 'radio',
                valueTypeTitle: '单选',
            },
            {
                valueType: 'switch',
                valueTypeTitle: '开关',
            },
        ]
    },
    {
        title: '上传',
        children: [
            {
                valueType: 'uploadImg',
                valueTypeTitle: '单图上传',
            },
            {
                valueType: 'uploadImgAll',
                valueTypeTitle: '多图上传',
            },
            {
                valueType: 'uploadImgVideoAll',
                valueTypeTitle: '多图/视频上传',
            },
            {
                valueType: 'uploadFile',
                valueTypeTitle: '单文件上传',
            },
            {
                valueType: 'uploadFileAll',
                valueTypeTitle: '多文件上传',
            },
        ]
    },
    {
        title: '地理位置',
        children: [
            {
                valueType: 'tencentMap',
                valueTypeTitle: '腾讯地图经纬度选择',
            },
            {
                valueType: 'province',
                valueTypeTitle: '省选择',
            },
            {
                valueType: 'provinceCity',
                valueTypeTitle: '省市选择',
            },
            {
                valueType: 'provinceCityArea',
                valueTypeTitle: '省市区选择',
            },
        ]
    },
    {
        title: '其它',
        children: [
            {
                valueType: 'teditor',
                valueTypeTitle: '编辑器',
            },
        ]
    },
];

export default formFields;
