import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { userApi } from '@/api/user';
import { App, Card, Row, Col, Tree } from 'antd';
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
    const onSearch = (id) => {
        if (id) {
            userApi.invitations({ id }).then(res => {
                setTreeKey(new Date().getTime());
                if (res.code === 1) {
                    setTreeData(res.data.map(item => {
                        return {
                            title: `${item.name}【${item.tel}】【${item.channels_level}(${item.channels_rate}%)】`,
                            key: item.id,
                            isLeaf: item.next_user_count > 0 ? false : true
                        }
                    }));
                } else {
                    message.error(res.message);
                }
            })
        }

    }

    // 展开的时候
    const onLoadData = async ({ key }) => {
        const result = await userApi.invitations({ pid: key });
        if (result.code === 1) {
            setTreeData(origin =>
                updateTreeData(origin, key, result.data.map(item => {
                    return {
                        title: `${item.name}【${item.tel}】【${item.channels_level}(${item.channels_rate}%)】`,
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
                            <SelectUser
                                onChange={onSearch}
                            />
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
