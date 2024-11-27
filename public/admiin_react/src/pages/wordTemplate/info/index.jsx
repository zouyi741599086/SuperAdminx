import { useRef, useState, useEffect, lazy } from 'react';
import {
  ModalForm,
} from '@ant-design/pro-components';
import {wordTemplateApi} from '@/api/wordTemplate';
import { App, Button, Input, Descriptions, Typography, Space } from 'antd';
import { useUpdateEffect } from 'ahooks';
import { authCkeck } from '@/common/function';
import PreviewImagesVideos from '@/pages/component/preview/imagesVideos/index';
import PreviewTeditor from '@/pages/component/preview/teditor/index';

export default ({ infoId, setInfoId, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();

    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});

    useUpdateEffect(() => {
        if (infoId > 0) {
            setOpen(true);
            wordTemplateApi.findData({
                id: infoId
            }).then(res => {
                if (res.code === 1) {
                    setData(res.data);
                } else {
                    message.error(res.message)
                }
            })
        }
    }, [infoId])

    //////////描述列表的列
    const [descriptionsItems, setDescriptionsItems] = useState([]);
    useEffect(() => {
        setDescriptionsItems([
            {
                key: 'title',
                label: '标题',
                children: <Typography.Text>{data.title}</Typography.Text>,
            },
            {
                key: 'description',
                label: '简介',
                children: <Typography.Paragraph
                        ellipsis={{
                            rows: 1,
                            expandable: 'collapsible',
                        }}
                >{data.description}</Typography.Paragraph>,
            },
            {
                key: 'status',
                label: '状态',
                children: <>
                    {data.status === 1 ? <>
                        <Typography.Text type="danger">待付款</Typography.Text>
                    </> : ''}
                    {data.status === 2 ? <>
                        <Typography.Text mark>待发货</Typography.Text>
                    </> : ''}
                    {data.status === 3 ? <>
                        <Typography.Text type="success">待收货</Typography.Text>
                    </> : ''}
                    {data.status === 4 ? <>
                        <Typography.Text type="success">待评价</Typography.Text>
                    </> : ''}
                    {data.status === 5 ? <>
                        <Typography.Text>已完成</Typography.Text>
                    </> : ''}
                    {data.status === 6 ? <>
                        <Typography.Text disabled>已关闭</Typography.Text>
                    </> : ''}
                    {data.status === 7 ? <>
                        <Typography.Text mark>退款审核中</Typography.Text>
                    </> : ''}
                    {data.status === 8 ? <>
                        <Typography.Text underline>已退款</Typography.Text>
                    </> : ''}
                </>,
            },
            {
                key: 'pv',
                label: '点击量',
                children: <Typography.Text type='danger'>{data.pv}</Typography.Text>,
            },
            {
                key: 'content',
                label: '内容',
                children: <PreviewTeditor title="内容" content={data.content} />,
            },
            {
                key: 'img',
                label: '图片',
                children: <PreviewImagesVideos imgs={data.img} />,
            },
            {
                key: 'create_time',
                label: '新增时间',
                children: <Typography.Text>{data.create_time}</Typography.Text>,
            },
        ]);
    }, [data]) 

    return <>
        <ModalForm
            name="WordTemplateInfo"
            formRef={formRef}
            open={open}
            onOpenChange={(_boolean) => {
                setOpen(_boolean);
                //关闭的时候干掉infoId，不然无法重复修改同一条数据
                if (_boolean === false) {
                setInfoId(0);
                }
            }}
            submitter={false}
            title="word模板详情"
            width={800}
        >
            <Descriptions 
                size="small" 
                column={2} 
                bordered={true}
                items={descriptionsItems}
            />
        </ModalForm>
    </>;
};