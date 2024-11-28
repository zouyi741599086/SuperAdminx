import {
    ProFormText,
    ProFormRadio,
    ProFormTreeSelect,
    ProFormDigit,
    ProFormDependency,
} from '@ant-design/pro-components';
import { Row, Col } from 'antd';

/**
 * 后台菜单 新增修改的form字段
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default (props) => {

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
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <ProFormText
                    key="name"
                    name="name"
                    label="权限英文名称"
                    placeholder="请输入"
                    rules={[
                        { required: true, message: '请输入' }
                    ]}
                    extra="必须唯一，可用控制器名+方法名，设置后最好不要更改，要修改react里面的按钮权限及控制器中的auth注释"
                />
            </Col>
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
                    extra="参数设置权限：不能在这编辑或添加，必须到/config去管理，会自动同步过来"
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
                        {
                            value: 7,
                            label: '参数设置权限',
                        },
                    ]}
                    rules={[
                        { required: true, message: '请选择' }
                    ]}
                />
            </Col>
            <ProFormDependency name={['type']}>
                {({ type }) => {
                    //不是菜单目录的时候才有上级
                    if ([2, 3, 4, 5, 6, 7].indexOf(type) !== -1) {
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
                    }
                }}
            </ProFormDependency>
            <ProFormDependency name={['type']}>
                {({ type }) => {
                    //2》菜单，4》iframe菜单，5》内页菜单 才有访问路劲
                    if ([2, 4, 5].indexOf(type) !== -1) {
                        return <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                            <ProFormText
                                key="path"
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
                    //2》菜单，5》内页菜单 才有组件路劲
                    if ([2, 5].indexOf(type) !== -1) {
                        return <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                            <ProFormText
                                key="component_path"
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
                    //1》菜单目录，2》菜单，3》外部链接菜单，4》iframe菜单 才有ico图标
                    if ([1, 2, 3, 4].indexOf(type) !== -1) {
                        return <>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                <ProFormText
                                    key="icon"
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
                    //3》外部链接菜单，4》iframe菜单 才有访问的url
                    if ([3, 4].indexOf(type) !== -1) {
                        return <>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                <ProFormText
                                    key="url"
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
                    //1》菜单目录，2》菜单，3》外部链接菜单，4》iframe菜单 才可以隐藏
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
                    //5》内页菜单权限，7》参数设置权限 才有参数选择
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
        </Row>
    </>;
};