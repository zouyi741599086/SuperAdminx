import { useState, useImperativeHandle } from 'react';
import { Modal, Timeline, Avatar, Typography, App, Badge } from 'antd';
import { userApi } from '@/api/user';

const PidPath = ({ ref, ...props }) => {
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState(0);

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
        open: (id) => {
            setUserId(id);
            selectPidPathUser(id);
            setOpen(true);
        }
    }));


    const [list, setList] = useState([]);
    const selectPidPathUser = (id) => {
        userApi.selectPidPathUser({
            id: id
        }).then(res => {
            if (res.code === 1) {
                let _list = [];
                res.data.map((item, index) => {
                    _list.push({
                        icon: <Badge count={index + 1} color="#faad14" size="small" />,
                        content: <>
                            <div style={{ display: 'flex' }}>
                                <div style={{ flex: 1, display: 'flex' }}>
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
                open={open}
                footer={null}
                onCancel={() => {
                    setOpen(false);
                }}
            >
                <Timeline
                    styles={{
                        root: {
                            marginTop: 24,
                            maxHeight: 500,
                            overflowY: 'auto',
                            padding: '10px'
                        }
                    }}
                    items={list}
                />
            </Modal>
        </>
    );
};

export default PidPath;