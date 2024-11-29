import {
    DrawerForm
} from '@ant-design/pro-components';
import { Button, Typography, List, Alert } from 'antd';
import { authCheck } from '@/common/function';
import {
    LinkOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";

/**
 * 小程序端连接，如开发小程序需要链接给客户看
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default (props) => {
    return (<>
        <DrawerForm
            title="链接"
            trigger={
                <Button
                    type="primary"
                    ghost
                    size="small"
                    icon={<LinkOutlined />}
                >获取小程序链接</Button>
            }
            submitter={false}
            width={500}
        >
            <Alert message="其它链接请前往各个管理列表进行复制~" type="warning" showIcon closable />
            <List
                pagination={false}
                dataSource={[
                    {
                        title: '首页',
                        description: <Typography.Paragraph copyable>/pages/index/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '畅享商家列表',
                        description: <Typography.Paragraph copyable>/pages/index_package/store/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '畅享商家详情',
                        description: <Button type="link" disabled={authCheck(379)}><Link type="link" to="/store">点此前往商家管理列表去复制</Link></Button>,
                        message: ''
                    },
                    {
                        title: '商家优惠券列表',
                        description: <Typography.Paragraph copyable>/pages/index_package/storeCoupon/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '商家入住申请',
                        description: <Typography.Paragraph copyable>/pages/index_package/store/settleIn/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '购买畅享中国卡',
                        description: <Typography.Paragraph copyable>/pages/index_package/chinaCard/index?type=1</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '购买畅享中国卡兑换券',
                        description: <Typography.Paragraph copyable>/pages/index_package/chinaCard/index?type=2</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '批量购买中国卡兑换券',
                        description: <Typography.Paragraph copyable>/pages/danye/index?id=7</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '畅享信息站',
                        description: <Typography.Paragraph copyable>/pages/informationStation/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '畅享信息列表',
                        description: <Typography.Paragraph copyable>/pages/index_package/information/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '畅享信息详情',
                        description: <Button type="link" disabled={authCheck(521)}><Link type="link" to="/information">点此前往畅享信息管理列表去复制</Link></Button>,
                        message: ''
                    },
                    {
                        title: '发布畅享信息',
                        description: <Typography.Paragraph copyable>/pages/index_package/information/add/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '我的',
                        description: <Typography.Paragraph copyable>/pages/user/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '我的中国卡',
                        description: <Typography.Paragraph copyable>/pages/user_package/myChinaCard/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '我的兑换券',
                        description: <Typography.Paragraph copyable>/pages/user_package/myChinaCardCoupon/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '中国卡兑换处',
                        description: <Typography.Paragraph copyable>/pages/user_package/chinaExchange/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '我的优惠券',
                        description: <Typography.Paragraph copyable>/pages/user_package/myCoupon/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '我的收藏',
                        description: <Typography.Paragraph copyable>/pages/user_package/myCollection/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '我发布的畅享信息',
                        description: <Typography.Paragraph copyable>/pages/user_package/myInformation/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '意见反馈',
                        description: <Typography.Paragraph copyable>/pages/user_package/feedback/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '联系客服',
                        description: <Typography.Paragraph copyable>/pages/user_package/customerService/index</Typography.Paragraph>,
                        message: ''
                    },
                    {
                        title: '关于我们',
                        description: <Typography.Paragraph copyable>/pages/danye/index?id=11</Typography.Paragraph>,
                        message: ''
                    },
                ]}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            title={item.title}
                            description={item.description}
                        />
                        {item?.message}
                    </List.Item>
                )}
            />
        </DrawerForm>
    </>
    );
};