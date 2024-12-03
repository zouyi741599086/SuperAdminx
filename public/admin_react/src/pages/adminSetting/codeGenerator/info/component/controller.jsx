import { useRef, useState, useEffect } from 'react';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import {
    ProCard,
    ProFormList,
    ProForm,
    ProFormText,
    ProFormGroup,
    ProFormSelect,
    ProFormCheckbox,
    ProFormTreeSelect,
} from '@ant-design/pro-components';
import { App, Space, Flex, Button, Affix, Row, Col } from 'antd';
import CodeHighlight from '@/component/codeHighlight';;
import { menuToTree } from '@/common/function';
import { adminMenuApi } from '@/api/adminMenu';

/**
 * 生成控制器
 */
export default ({ tableName, operationFile, ...props }) => {
    const { message } = App.useApp();
    const formRef = useRef();

    useEffect(() => {
        getMenuList();
    }, [tableName]);

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

    // 请求类型
    const methods = [
        {
            label: 'get',
            value: 'get',
        },
        {
            label: 'post',
            value: 'post',
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
                return result.data || {};
            }}
            submitter={false}
            onFinish={async (values) => {
                adminCodeGeneratorApi.generatorCode({
                    controller: {
                        ...values.controller, //只要form中的这些值
                        file_suffix: 'php', //生成文件的后缀名称
                    },
                    table_name: tableName,
                    code_name: 'controller', //生成的代码名称
                }).then(res => {
                    if (res.code === 1) {
                        message.success(res.message);
                        formRef.current.setFieldValue('controller_code', res.data.controller_code);
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
                            name={['controller', 'file_name']}
                            label="控制器类名"
                            placeholder="请输入"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                        <ProFormText
                            name={['controller', 'file_path']}
                            label="命名空间"
                            placeholder="请输入"
                            extra="控制器路劲，同时也是命名空间"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <ProFormCheckbox.Group
                            name={['controller', 'functions']}
                            label="生成的方法"
                            options={[
                                {
                                    label: '获取列表',
                                    value: 'getList',
                                },
                                {
                                    label: '新增',
                                    value: 'create',
                                },
                                {
                                    label: '获取一条数据',
                                    value: 'findData',
                                },
                                {
                                    label: '更新',
                                    value: 'update',
                                },
                                {
                                    label: '删除',
                                    value: 'delete',
                                },
                                {
                                    label: '更新排序',
                                    value: 'updateSort',
                                },
                                {
                                    label: '更新状态',
                                    value: 'updateStatus',
                                },
                                {
                                    label: '搜索选择某条数据',
                                    value: 'select',
                                },
                                {
                                    label: '导入数据',
                                    value: 'importData',
                                },
                                {
                                    label: '导出数据',
                                    value: 'exportData',
                                },
                            ]}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <ProFormCheckbox.Group
                            name={['controller', 'functions_auth']}
                            label="需要验证接口级别权限的方法"
                            options={[
                                {
                                    label: '获取列表',
                                    value: 'getList',
                                },
                                {
                                    label: '新增',
                                    value: 'create',
                                },
                                {
                                    label: '更新',
                                    value: 'update',
                                },
                                {
                                    label: '删除',
                                    value: 'delete',
                                },
                                {
                                    label: '更新排序',
                                    value: 'updateSort',
                                },
                                {
                                    label: '更新状态',
                                    value: 'updateStatus',
                                },
                                {
                                    label: '导入数据',
                                    value: 'importData',
                                },
                                {
                                    label: '导出数据',
                                    value: 'exportData',
                                },
                            ]}
                        />
                    </Col>
                </Row>

                <ProFormList
                    name={['controller', 'other_functions']}
                    label="添加其它方法"
                    creatorButtonProps={{
                        creatorButtonText: '添加方法'
                    }}
                >
                    <ProFormGroup>
                        <ProFormText
                            name="title"
                            label="方法名称(中文)"
                            placeholder="请输入"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                            fieldProps={{
                                style: { width: 180 }
                            }}
                        />
                        <ProFormText
                            name="name"
                            label="方法名称(英文)"
                            placeholder="请输入"
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                            fieldProps={{
                                style: { width: 180 }
                            }}
                        />
                        <ProFormSelect
                            name="method"
                            label="请求类型"
                            placeholder="请选择"
                            request={async () => {
                                return methods;
                            }}
                            rules={[
                                { required: true, message: '请输入' }
                            ]}
                            fieldProps={{
                                style: { width: 180 }
                            }}
                        />
                        <ProFormTreeSelect
                            name={['auth_id']}
                            label="访问接口权限节点(如需要)"
                            placeholder="请选择"
                            rules={[
                                //{ required: true, message: '请选择' }
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

                <ProForm.Item name="controller_code" >
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
                            operationFile('controller');
                        }}
                    >生成到项目</Button>
                </Flex>
            </ProCard>
        </Affix>
    </>
}
