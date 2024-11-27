import { lazy } from 'react';
import {
    ProForm,
    ProFormText, ProFormTextArea, ProFormDateTimePicker,
} from '@ant-design/pro-components';
import { Row, Col } from 'antd';
import Teditor from '@/pages/component/form/teditor/index';
import TencentMap from '@/pages/component/form/tencentMap/index';
import UploadImg from '@/pages/component/form/uploadImg/index';
import SelectUser from '@/pages/components/selectUser';

/**
 * 添加修改的form字段
 * @param {string} type create》添加，update》修改
 */
export default ({ type, ...props }) => {

    return <>
        <Row gutter={[24, 0]}>

            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <ProFormText
                    name="title"
                    label="标题"
                    placeholder="请输入"
                    fieldProps={{
                    }}
                    extra=""
                    rules={[
                        { required: true, message: '请输入' },
                    ]}
                />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <ProFormTextArea
                    name="description"
                    label="简介"
                    placeholder="请输入"
                    fieldProps={{
                    }}
                    extra=""
                    rules={[
                        { required: true, message: '请输入' },
                    ]}
                />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <ProForm.Item
                    name="jingweidu"
                    label="经纬度"
                    rules={[
                        { required: true, message: '请选择' },
                    ]}
                    extra=""
                >
                    <TencentMap />
                </ProForm.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
                <ProForm.Item
                    name="img"
                    label="图片"
                    rules={[
                        //{ required: true, message: '请输入' },
                    ]}
                    extra=""
                >
                    <UploadImg />
                </ProForm.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <ProForm.Item
                    name="content"
                    label="内容"
                    rules={[
                        //{ required: true, message: '请输入' },
                    ]}
                    extra=""
                >
                    <Teditor />
                </ProForm.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <ProFormDateTimePicker
                    name="create_time"
                    label="新增时间"
                    placeholder="请选择"
                    fieldProps={{
                        style: { width: '100%' },
                    }}
                    extra=""
                    rules={[
                        { required: true, message: '请选择' },
                    ]}
                />
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                <ProForm.Item
                    name="user_id"
                    label="所属用户"
                    rules={[
                        { required: true, message: '请选择' },
                    ]}
                    extra=""
                >
                    <SelectUser />
                </ProForm.Item>
            </Col>
        </Row>
    </>
}
