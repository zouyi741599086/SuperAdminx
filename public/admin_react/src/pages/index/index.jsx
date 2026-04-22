import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Space, Avatar, Typography, Tag, Card } from 'antd';
import { useSnapshot } from 'valtio';
import { adminUserStore, setAdminUserStore } from '@/store/adminUser';
import { layoutSettingStore, setLayoutSettingStore } from '@/store/layoutSetting';
import { useMount } from 'ahooks';
import ShortcutMenu from './component/shortcutMenu/index';
import Statistics from './component/statistics'
import Todo from './component/todo/index';

/**
 * 后台首页
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
const Index = () => {
    const adminUser = useSnapshot(adminUserStore);
    const layoutSetting = useSnapshot(layoutSettingStore);

    useMount(() => {
    })

    return <>
        <PageContainer
            ghost
            className="sa-page-container"
        >
            <Space
                orientation="vertical"
                size="middle"
                styles={{
                    root: { width: '100%' }
                }}
            >

                <Row gutter={[0, 20]}>
                    <Col span={24} >
                        <Card
                            styles={{
                                root: { marginTop: '4px' }
                            }}
                            variant="borderless"
                        >
                            <Row type="flex" gutter={[12, 0]}>
                                <Col flex={0}>
                                    <Avatar size={50} src={`${adminUser.img}`}>{adminUser.name?.substr(0, 1)}</Avatar>
                                </Col>
                                <Col flex={1}>
                                    <Row>
                                        <Col span={24} >
                                            <Space>
                                                <Typography.Title
                                                    level={4}
                                                    style={{ margin: '0px', display: 'inline-block' }}
                                                >{adminUser.name}</Typography.Title>
                                                <Tag color="blue">{adminUser.AdminRole?.title}</Tag>
                                            </Space>
                                        </Col>
                                        <Col span={24}>
                                            <Typography.Title
                                                level={5}
                                                style={{ margin: '0px', fontWeight: 'normal' }}
                                            >{adminUser.tel}</Typography.Title>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            {!layoutSetting.isMobile ? <>
                                <iframe
                                    scrolling="no"
                                    style={{ width: '100%', height: '50px', marginTop: 20 }}
                                    frameBorder="0"
                                    allowtransparency="true"
                                    src={`//i.tianqi.com/index.php?c=code&id=12&icon=1&num=5&site=12${layoutSetting.antdThemeValue == 'dark' ? '&color=%23FFFFFF' : ''}`}
                                ></iframe>
                            </> : ''}
                        </Card>
                    </Col>

                    <Col span={24} >
                        <Row gutter={[20, 20]}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={16} xxxl={16}>
                                <Space
                                    orientation="vertical"
                                    size="middle"
                                    styles={{
                                        root: { width: '100%' }
                                    }}
                                >
                                    <ShortcutMenu />
                                    <Statistics />
                                </Space>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={8} xxxl={8}>
                                <Todo />
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Space>
        </PageContainer >
    </>
}

export default Index;