import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { adminCodeGeneratorApi } from '@/api/adminCodeGenerator';
import { Typography, Input, Row, Col, Card } from 'antd';
import { authCheck } from '@/common/function';
import { NavLink } from "react-router-dom";
import { useMount, useDebounceFn } from 'ahooks';
import {
    DatabaseTwoTone,
    RightSquareTwoTone
} from '@ant-design/icons';
import './index.css';

/**
 * 代码生成
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default () => {

    const [list, setList] = useState([]);

    useMount(() => {
        adminCodeGeneratorApi.getTableList().then(res => {
            setList(res.data);
        });
    })

    // 搜索 防抖
    const [keywords, setKeywords] = useState('');
    const { run: onSearch } = useDebounceFn(
        (value) => {
            setKeywords(value);
            setList(list.map(item => {
                item.keywords_show = value ? item.Name.indexOf(value) !== -1 : true;
                return item;
            }));
        },
        {
            wait: 200,
        },
    );

    return (
        <>
            <PageContainer
                className="sa-page-container"
                ghost
                header={{
                    title: '代码生成器',
                    subTitle: `共${list.length || 0}张表`,
                    style: { padding: '0 24px 12px' },
                }}
                extra={[
                    <Input.Search
                        placeholder="搜索表名..."
                        onSearch={(value) => {
                            onSearch(value)
                        }}
                        onChange={(e) => {
                            onSearch(e.target.value)
                        }}
                        key={1}
                    />
                ]}
            >
                <Row gutter={[12, 16]} className="code-generator">
                    {list.map(item => {
                        if (item.keywords_show !== undefined && item.keywords_show == false) {
                            return '';
                        }
                        return <Col
                            key={item.Name}
                            xs={24}
                            sm={12}
                            md={12}
                            lg={8}
                            xl={6}
                            xxl={4}
                        >
                            <NavLink to={authCheck('codeGeneratorInfo') ? '' : `/adminSetting/codeGenerator/info?name=${item.Name}`}>
                                <Card
                                    size="small"
                                    hoverable
                                    title={<>
                                        <DatabaseTwoTone />
                                        <Typography.Title level={5} className="title">
                                            <span>{item.Name.substr(0, item.Name.indexOf(keywords))}</span>
                                            <span style={{ color: 'red' }}>{keywords}</span>
                                            <span>{item.Name.substr(item.Name.indexOf(keywords) + keywords.length)}</span>
                                        </Typography.Title>
                                    </>}
                                    extra={<RightSquareTwoTone />}
                                >
                                    {item.Comment}
                                    <br />
                                    {item.Create_time}
                                </Card>
                            </NavLink>
                        </Col>
                    })}
                </Row>
            </PageContainer>
        </>
    )
}
