import { ProForm, ProFormText, ProFormDigit, } from '@ant-design/pro-components';
import { Row, Col } from 'antd';
import SelectUser from '@/components/selectUser';

/**
 * 用户 添加修改的form字段
 * 
 * @param {string} typeAction create》添加，update》修改
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default ({typeAction, ...props}) => {

    return <>
        <Row gutter={[24, 0]}>
            
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <ProFormText
                    name="name"
                    label="姓名"
                    placeholder="请输入"
                    rules={[
                        { required: true, message: '请输入' },
                    ]}
                />
            </Col>    
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <ProFormDigit
                    name="tel"
                    label="手机号"
                    placeholder="请输入"
                    fieldProps={{
                        precision: 0,
                        style: {width: '100%'},
                    }}
                    min={0}
                    rules={[
                        { required: true, message: '请输入' },
                        { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' },
                    ]}
                />
            </Col>    
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <ProForm.Item
                    name="pid"
                    label="上级用户"
                    rules={[
                        //{ required: true, message: '请选择' },
                    ]}
                >
                    <SelectUser />
                </ProForm.Item>
            </Col>
        </Row>
    </>
}
