import { useState, useEffect } from 'react';
import { Modal, Timeline, Avatar, Typography, App, Badge } from 'antd';
import { userApi } from '@/api/user';

export default ({ pidPathUserId, setPidPathUserId, ...props }) => {
    const { message } = App.useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsModalOpen(pidPathUserId ? true : false);
        if (pidPathUserId) {
            selectPidPathUser();
        }
    }, [pidPathUserId])

    const [list, setList] = useState([]);
    const selectPidPathUser = () => {
        userApi.selectPidPathUser({
            id: pidPathUserId
        }).then(res => {
            if (res.code === 1) {
                let _list = [];
                res.data.map((item, index) => {
                    _list.push({
                        dot: <Badge count={index + 1} color="#faad14" size="small" />,
                        children: <>
                            <div style={{ display: 'flex' }}>
                                <div style={{ flex: 1 ,display: 'flex'}}>
                                    <Avatar
                                        src={item?.img}
                                        style={{
                                            flexShrink: 0
                                        }}
                                    >{item?.name?.substr(0, 1)}</Avatar>
                                    <div style={{ paddingLeft: '5px' }}>
                                        {item?.name}<br />
                                        <Typography.Paragraph
                                            copyable
                                            style={{
                                                margin: 0
                                            }}
                                        >{item?.tel}</Typography.Paragraph>
                                    </div>
                                </div>
                                <div style={{ paddingLeft: '30px' }}>
                                    
                                </div>
                            </div>
                        </>
                    })
                })
                setList(_list);
            } else {
                message.error(res.message);
            }
        })
    }


    return (
        <>
            <Modal
                title="推荐路劲"
                open={isModalOpen}
                footer={null}
                onCancel={() => {
                    setIsModalOpen(false);
                    setPidPathUserId(null);
                }}
            >
                <Timeline
                    style={{
                        marginTop: 24,
                        maxHeight: 500,
                        overflowY: 'auto',
                        padding: '10px'
                    }}
                    items={list}
                />
            </Modal>
        </>
    );
};