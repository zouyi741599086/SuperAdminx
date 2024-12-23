import { useRef, useState, useEffect } from 'react'
import { Button, App, Row, Col, Alert, Modal, Input, Space, Select } from 'antd'
import { useThrottleEffect } from 'ahooks'
import { CloseCircleOutlined } from '@ant-design/icons'
import { TMap as Map, MultiMarker } from 'tlbs-map-react';

/**
 * 腾讯地图经纬选择坐标：https://mapapi.qq.com/web/tlbs-map-react/components/t-map
 * @param {value} String 默认值
 * @param {onChange} fun 修改value事件
 */
export default ({ value, onChange }) => {
    const mapRef = useRef();
    const markerRef = useRef();
    const { message } = App.useApp()

    //搜索的关键字
    const [searchKeywords, setSearchKeywords] = useState(null)
    // 搜索列表
    const [searchResultList, setSearchResultList] = useState([])
    //弹出框显示与否
    const [open, setOpen] = useState(false)
    //地图后端搜索服务
    const [suggest, setSuggest] = useState(null);
    //被组件的值，默认经纬度
    const [latLng, setLatLng] = useState({
        lat: value ? value.split(',')[0] : 29.552703,
        lng: value ? value.split(',')[1] : 106.549358
    })
    //地图的中心点
    const [geometries, setGeometries] = useState([]);

    //本组件值被改变的时候，改变地图的marker点
    useEffect(() => {
        if (latLng.lat && latLng.lng) {
            setGeometries([
                {
                    styleId: 'multiMarkerStyle1',
                    position: {
                        lat: latLng.lat,
                        lng: latLng.lng
                    },
                }
            ])
        }
    }, [latLng])

    //确认选择的时候
    const confirmChange = () => {
        if (!latLng) {
            message.error('请点击地图选择位置~')
            return false
        }
        onChange(`${latLng.lat},${latLng.lng}`)
        setOpen(false)
    }

    //点击搜索的时候
    const mapSearch = () => {
        if (!searchKeywords) {
            return false;
        }
        let _suggest = suggest;
        if (!_suggest) {
            _suggest = new TMap.service.Suggestion({
                // 新建一个关键字输入提示类
                pageSize: 20, // 返回结果每页条目数
                //region: '重庆', // 限制城市范围
                regionFix: false, // 搜索无结果时是否固定在当前城市
            });
            setSuggest(_suggest);
        }

        _suggest.getSuggestions({ keyword: searchKeywords }).then((result) => {
            if (result.data?.length) {
                // 以当前所输入关键字获取输入提示
                setSearchResultList(result.data)
            } else {
                message.error('没有相关信息！')
            }
        })
            .catch((error) => {
                message.error(error.message)
            })
    }
    //搜索出来的地址 点击选择的时候
    const selectOnChange = (e) => {
        searchResultList.some((item) => {
            if (item.id == e) {
                setLatLng({
                    lat: item.location.lat,
                    lng: item.location.lng
                });
                return true;
            }
        })
    }
    //输入搜索关键字的时候，防抖搜索
    useThrottleEffect(
        () => {
            mapSearch()
        },
        [searchKeywords],
        {
            wait: 1000,
        },
    );

    return (
        <>
            <Row gutter={[10, 0]}>
                <Col flex="auto" style={{ flex: 1 }}>
                    <Input value={value} disabled placeholder='请选择位置' allowClear />
                </Col>
                <Col flex="none">
                    <Space>
                        {value ? <>
                            <Button type='dashed' icon={<CloseCircleOutlined />} onClick={() => onChange('')}></Button>
                        </> : ''}
                        <Button onClick={() => setOpen(true)}>选择位置</Button>
                    </Space>
                </Col>
            </Row>

            <Modal open={open} title='选择位置' width={800} onOk={confirmChange} onCancel={() => setOpen(false)}>
                <Space direction='vertical' style={{ width: '100%' }} size='middle'>
                    <Alert message='直接点击地图，设置位置~' type='info' show-icon />
                    <div className='rowSearch'>
                        <Select
                            showSearch
                            allowClear
                            value={searchKeywords}
                            placeholder='请输入地址搜索'
                            style={{ width: '100%' }}
                            filterOption={false}
                            onSearch={setSearchKeywords}
                            onChange={selectOnChange}
                            options={searchResultList}
                            fieldNames={{
                                label: 'title',
                                value: 'id',
                            }}
                        />
                    </div>
                    <Map
                        ref={mapRef}
                        apiKey="UBCBZ-MLQL4-PKWUD-DNVHI-TQPMH-CGFU3"
                        control={{
                            zoom: {
                                position: 'topRight',
                                numVisible: true,
                            },
                        }}
                        libraries="service"
                        options={{
                            center: latLng,
                            zoom: 14,
                            showControl: true
                        }}
                        onClick={(e) => {
                            setLatLng({
                                lat: e.latLng.lat,
                                lng: e.latLng.lng
                            })
                        }}
                    >
                        <MultiMarker
                            ref={markerRef}
                            //点的样式，是个对象可以有多个样式，然后在marker点里面应用key就行
                            styles={{
                                //点的样式
                                multiMarkerStyle1: {
                                    width: 30,
                                    height: 45,
                                    anchor: { x: 15, y: 45 },
                                }
                            }}
                            //marker点，是个数组，可以添加多个marker
                            geometries={geometries}
                            onClick={(e) => {
                                //某个marker点被点击的时候
                            }}
                        />
                    </Map>
                </Space>
            </Modal>
        </>
    )
}
