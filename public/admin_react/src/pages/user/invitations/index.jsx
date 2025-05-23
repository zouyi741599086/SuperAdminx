import { useRef, lazy, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { userApi } from '@/api/user';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Typography, Card, Space, Row, Col, Tooltip, Avatar, Tree, Input } from 'antd';
import {
    CloudDownloadOutlined,
} from '@ant-design/icons';
import { authCheck } from '@/common/function';
import { fileApi } from '@/api/file';
import Lazyload from '@/component/lazyLoad/index';
import SelectUser from '@/components/selectUser';
const updateTreeData = (list, key, children) =>
    list.map(node => {
        if (node.key === key) {
            return Object.assign(Object.assign({}, node), { children });
        }
        if (node.children) {
            return Object.assign(Object.assign({}, node), {
                children: updateTreeData(node.children, key, children),
            });
        }
        return node;
    });

/**
 * 用户 
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default () => {
    const { message } = App.useApp();

    const [treeData, setTreeData] = useState([]);
    const [treeKey, setTreeKey] = useState(new Date().getTime());

    // 搜索的时候
    const onSearch = (tel) => {
        userApi.invitations({ tel }).then(res => {
            setTreeKey(new Date().getTime());
            if (res.code === 1) {
                setTreeData(res.data.map(item => {
                    return {
                        title: `${item.name}【${item.tel}】`,
                        key: item.id,
                        isLeaf: item.next_user_count > 0 ? false : true
                    }
                }));
            } else {
                message.error(res.message);
            }
        })
    }

    // 展开的时候
    const onLoadData = async ({ key }) => {
        const result = await userApi.invitations({ pid: key });
        if (result.code === 1) {
            setTreeData(origin =>
                updateTreeData(origin, key, result.data.map(item => {
                    return {
                        title: `${item.name}【${item.tel}】`,
                        key: item.id,
                        isLeaf: item.next_user_count > 0 ? false : true
                    }
                })),
            );
        } else {
            message.error(result.message);
        }

    }

    return (
        <>
            <PageContainer
                className="sa-page-container"
                ghost
                header={{
                    title: '用户推荐关系查询',
                    style: { padding: '0px 24px 12px' },
                }}
            >
                <Card
                    variant="borderless"
                >
                    <Row gutter={[24, 24]}>
                        <Col xs={24} sm={24} md={12} xl={8} xxl={6}>
                            <Input.Search placeholder="请输入完整的手机号" onSearch={onSearch} enterButton />
                        </Col>
                        <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                            <Tree
                                key={treeKey}
                                loadData={onLoadData}
                                treeData={treeData}
                                showLine
                            />
                        </Col>
                    </Row>

                </Card>
            </PageContainer>
        </>
    )
}
