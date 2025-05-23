import {
    ProFormText,
    ProFormRadio,
    ProFormTreeSelect,
    ProFormDigit,
    ProFormSelect,
    ProFormDependency,
} from '@ant-design/pro-components';
import { Row, Col } from 'antd';

/**
 * 后台菜单 新增修改的form字段
 * 
 * @param {string} typeAction 新增还是修改
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default ({ typeAction, ...props }) => {

    return <>
        <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <ProFormText
                    name="title"
                    label="名称"
                    placeholder="请输入"
                    rules={[
                        { required: true, message: '请输入' }
                    ]}
                    extra="【只浏览数据】只能是这个文字，前端搜索菜单有用来做判断"
                />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <ProFormText
                    name="desc"
                    label="描述"
                    placeholder="请输入"
                    rules={[
                    ]}
                    extra="主要用于功能菜单搜索"
                />
            </Col>
            <ProFormDependency name={['type']}>
                {({ type }) => {
                    return <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <ProFormText
                            name="name"
                            label="权限英文名称"
                            placeholder="请输入"
                            disabled={type == 7}
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                            tooltip="系统内置几个权限名称规则，表名转驼峰首字母小写，如adminUser，内置了列表页：xxx，只浏览数据：xxxGetList、新增：xxxCreate、修改：xxxUpdate、查看详情：xxxInfo、删除：xxxDelete、修改排序：xxxUpdateSort、修改状态：xxxUpdateStatus、导出数据：xxxExportData、导入数据：xxxImportData；代码生成的时候会按照此规则获取权限名称自动注入权限！"
                            extra="须唯一，列表页用控制器名，如adminUser，其它用控制器名+方法名如adminUserGetList，设置后最好不要更改，否则要修改react里面的按钮权限及控制器中的auth注释"
                        />
                    </Col>
                }}
            </ProFormDependency>

            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <ProFormDigit
                    name="sort"
                    label="排序"
                    min={0}
                    fieldProps={{ precision: 0 }}
                    rules={[
                        { required: true, message: '请输入' }
                    ]}
                />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <ProFormRadio.Group
                    name="type"
                    label="类型"
                    options={[
                        {
                            value: 1,
                            label: '菜单目录',
                        },
                        {
                            value: 2,
                            label: '菜单',
                        },
                        {
                            value: 3,
                            label: '外部链接菜单',
                        },
                        {
                            value: 4,
                            label: 'iframe菜单',
                        },
                        {
                            value: 5,
                            label: '内页菜单权限',
                        },
                        {
                            value: 6,
                            label: '按钮权限',
                        },
                        // { // 不能新增或编辑，此类型的数据是》参数设置自动同步过来的
                        //     value: 7,
                        //     label: '参数设置权限',
                        // },
                    ]}
                    rules={[
                        { required: true, message: '请选择' }
                    ]}
                />
            </Col>
            <ProFormDependency name={['type']}>
                {({ type }) => {
                    return <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <ProFormTreeSelect
                            name="pid_name"
                            label="所属上级"
                            placeholder="请选择"
                            allowClear
                            fieldProps={{
                                showSearch: true,
                                treeData: props.menuList,
                                treeNodeFilterProp: 'title',
                                fieldNames: {
                                    value: 'name',
                                    label: 'title',
                                },
                            }}
                            rules={[
                                // 5》内页菜单权限，6》按钮操作权限，7》参数设置权限 才必填
                                { required: [5, 6, 7].indexOf(type) !== -1 ? true : false, message: '请选择' }
                            ]}
                        />
                    </Col>
                }}
            </ProFormDependency>
            <ProFormDependency name={['type']}>
                {({ type }) => {
                    // 2》菜单，4》iframe菜单，5》内页菜单 才有访问路劲
                    if ([2, 4, 5].indexOf(type) !== -1) {
                        return <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                            <ProFormText
                                name="path"
                                label="访问路劲"
                                placeholder="请输入"
                                rules={[
                                    { required: true, message: '请输入' }
                                ]}
                            />
                        </Col>
                    }
                }}
            </ProFormDependency>
            <ProFormDependency name={['type']}>
                {({ type }) => {
                    // 2》菜单，5》内页菜单 才有组件路劲
                    if ([2, 5].indexOf(type) !== -1) {
                        return <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                            <ProFormText
                                name="component_path"
                                label="组件路劲"
                                placeholder="请输入"
                                rules={[
                                    { required: true, message: '请输入' }
                                ]}
                            />
                        </Col>
                    }
                }}
            </ProFormDependency>
            <ProFormDependency name={['type']}>
                {({ type }) => {
                    // 1》菜单目录，2》菜单，3》外部链接菜单，4》iframe菜单 才有ico图标
                    if ([1, 2, 3, 4].indexOf(type) !== -1) {
                        return <>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                <ProFormText
                                    name="icon"
                                    label="阿里云图标"
                                    placeholder="请输入"
                                    extra="分栏布局的时候二级菜单也会需要图标"
                                    rules={[
                                        { required: true, message: '请输入' }
                                    ]}
                                />
                            </Col>
                        </>
                    }
                }}
            </ProFormDependency>
            <ProFormDependency name={['type']}>
                {({ type }) => {
                    // 3》外部链接菜单，4》iframe菜单 才有访问的url
                    if ([3, 4].indexOf(type) !== -1) {
                        return <>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                <ProFormText
                                    name="url"
                                    label="访问url"
                                    placeholder="请输入"
                                    rules={[
                                        { required: true, message: '请输入' }
                                    ]}
                                />
                            </Col>
                        </>
                    }
                }}
            </ProFormDependency>

            <ProFormDependency name={['type']}>
                {({ type }) => {
                    // 1》菜单目录，2》菜单，3》外部链接菜单，4》iframe菜单 才可以隐藏
                    if ([1, 2, 3, 4].indexOf(type) !== -1) {
                        return <>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                <ProFormRadio.Group
                                    name="hidden"
                                    label="是否隐藏"
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
                                    extra="角色管理、菜单中都不会出现此权限"
                                    rules={[
                                        { required: true, message: '请选择' }
                                    ]}
                                />
                            </Col>
                        </>
                    }
                }}
            </ProFormDependency>
            <ProFormDependency name={['type']}>
                {({ type }) => {
                    // 5》内页菜单权限，7》参数设置权限 才有参数选择
                    if ([5, 7].indexOf(type) !== -1) {
                        return <>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                <ProFormRadio.Group
                                    name="is_params"
                                    label="进入页面是否有参数"
                                    options={[
                                        {
                                            label: '无',
                                            value: 1,
                                        },
                                        {
                                            label: '有',
                                            value: 2,
                                        },
                                    ]}
                                    extra="修改、详情；用于菜单功能搜索的时候不能直接展示此链接，而要找上级的链接展示，防止直接进入此页面"
                                    rules={[
                                        { required: true, message: '请选择' }
                                    ]}
                                />
                            </Col>
                        </>
                    }
                }}
            </ProFormDependency>

            {typeAction == 'create' ? <>
                <ProFormDependency name={['type']}>
                    {({ type }) => {
                        // 是菜单的时候，是否自动生成菜单下面的增删改查的权限节点
                        if (type == 2) {
                            return <>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                    <ProFormSelect
                                        name="auto_auth"
                                        label="自动生成权限节点"
                                        extra="是否自动生成菜单下面的权限节点"
                                        options={[
                                            { label: '只浏览数据', value: 'GetList' },
                                            { label: '添加', value: 'Create' },
                                            { label: '修改', value: 'Update' },
                                            { label: '查看详情', value: 'Info' },
                                            { label: '删除', value: 'Delete' },
                                            { label: '修改排序', value: 'UpdateSort' },
                                            { label: '修改状态', value: 'UpdateStatus' },
                                            { label: '导出数据', value: 'ExportData' },
                                            { label: '导入数据', value: 'ImportData' },
                                        ]}
                                        fieldProps={{
                                            mode: 'multiple',
                                        }}
                                        rules={[
                                            //{ required: true, message: '请输入' }
                                        ]}
                                    />
                                </Col>
                                <ProFormDependency name={['auto_auth']}>
                                    {({ auto_auth }) => {
                                        if (Array.isArray(auto_auth)) {
                                            let _component = [];

                                            if (auto_auth.indexOf('Create') !== -1 || auto_auth.indexOf('Update') !== -1) {
                                                _component.push(<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} key="1">
                                                    <ProFormRadio.Group
                                                        name="auto_auth_create_update_type"
                                                        label="添加修改页面打开类型"
                                                        options={[
                                                            {
                                                                label: '弹窗打开',
                                                                value: 1,
                                                            },
                                                            {
                                                                label: '新页面打开',
                                                                value: 2,
                                                            },
                                                        ]}
                                                        rules={[
                                                            { required: true, message: '请选择' }
                                                        ]}
                                                    />
                                                </Col>);
                                            }

                                            if (auto_auth.indexOf('Info') !== -1) {
                                                _component.push(<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} key="2">
                                                    <ProFormRadio.Group
                                                        name="auto_auth_info_type"
                                                        label="详情页面打开类型"
                                                        options={[
                                                            {
                                                                label: '弹窗打开',
                                                                value: 1,
                                                            },
                                                            {
                                                                label: '新页面打开',
                                                                value: 2,
                                                            },
                                                        ]}
                                                        rules={[
                                                            { required: true, message: '请选择' }
                                                        ]}
                                                    />
                                                </Col>);
                                            }
                                            return _component;
                                        }
                                    }}
                                </ProFormDependency>
                            </>
                        }
                    }}
                </ProFormDependency>
            </> : ''}

        </Row>
    </>;
};