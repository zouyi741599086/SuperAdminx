import { useRef, useState, useEffect } from 'react';
import { Button, App, Alert, Modal, Input, Space, Select } from 'antd';
import { useMount, useThrottleEffect } from 'ahooks';
import { CloseCircleOutlined } from '@ant-design/icons';
import { config } from '@/common/config.js';

let map, markerLayer, geocoder, suggest, infoWindow;

const MapMain = ({ value, setLatLng, ...props }) => {
    const { message } = App.useApp();
    const [searchResultList, setSearchResultList] = useState([]);
    const [scriptLoaded, setScriptLoaded] = useState(false); // 脚本加载状态
    const [isInitMap, setIsInitMap] = useState(false);
    const containerRef = useRef();

    useMount(() => {
        // 加载腾讯地图脚本
        if (!document.getElementById('tencentMap') && !window.TMap) {
            const url = `//map.qq.com/api/gljs?v=1.exp&libraries=service&key=${config.tencentApiKey}`;
            const script = document.createElement('script');
            script.src = url;
            script.id = 'tencentMap';
            script.onload = () => setScriptLoaded(true); // 加载完成标记
            document.head.appendChild(script);
        } else if (window.TMap) {
            setScriptLoaded(true);
        }
    });

    // 初始化地图
    useEffect(() => {
        if (!scriptLoaded) return; // 等待脚本加载

        if (!map && !isInitMap && containerRef) {
            const _value = value || '29.492804,106.526012';
            const [lat, lng] = _value.split(',').map(v => parseFloat(v.trim()));
            if (!isNaN(lat) && !isNaN(lng)) {
                initMap(lat, lng);
            } else {
                message.error('经纬度错误');
            }
            setIsInitMap(true);
        }
    }, [scriptLoaded, value, isInitMap, containerRef]);

    // 初始化地图
    const initMap = (lat, lng) => {
        if (!containerRef || !window.TMap) return;

        map = new TMap.Map(containerRef.current, {
            zoom: 14,
            center: new TMap.LatLng(lat, lng),
            pitch: 50,
            rotation: 0,
        });
        setLatLng({ lat, lng });

        // 创建初始 marker
        markerLayer = new TMap.MultiMarker({
            map: map,
            geometries: [
                {
                    id: 'center',
                    position: map.getCenter(),
                },
            ],
        });

        // 地图点击事件：移动 marker
        map.on('click', (evt) => {
            if (markerLayer) {
                markerLayer.setGeometries([]);
                markerLayer.updateGeometries([
                    {
                        id: '0',
                        position: evt.latLng,
                    },
                ]);
            }
            if (infoWindow) infoWindow.close();
            setLatLng(evt.latLng);
        });

        map.setViewMode('3D');
        // 地址解析与提示服务
        geocoder = new TMap.service.Geocoder();
        suggest = new TMap.service.Suggestion({
            pageSize: 20,
            regionFix: false,
        });
    };

    // 搜索关键词
    const [searchKeywords, setSearchKeywords] = useState(null);
    const mapSearch = () => {
        if (!suggest || !searchKeywords) return;
        suggest.getSuggestions({
            keyword: searchKeywords,
            location: map.getCenter()
        }).then((result) => {
            if (result.data?.length) {
                setSearchResultList(result.data);
            } else {
                message.error('没有相关信息！');
            }
        }).catch((error) => {
            message.error(error.message);
        });
    };

    // 选择搜索结果
    const selectOnChange = (selectedId) => {
        const info = searchResultList.find(item => item.id === selectedId);
        if (!info) return;
        if (!markerLayer) return;
        // 关闭现有信息窗
        if (infoWindow) infoWindow.close();
        // 更新 marker
        markerLayer.setGeometries([]);
        markerLayer.updateGeometries([
            {
                id: '0',
                position: info.location,
            },
        ]);
        // 显示信息窗
        infoWindow = new TMap.InfoWindow({
            map: map,
            position: info.location,
            content: `<h3>${info.title}</h3><p>地址：${info.address}</p>`,
            offset: { x: 0, y: -50 },
        });
        map.setCenter(info.location);
        setLatLng({ lat: info.location.lat, lng: info.location.lng });
    };

    useThrottleEffect(
        () => {
            mapSearch();
        },
        [searchKeywords],
        { wait: 1000 }
    );

    return <>
        <Space orientation="vertical" style={{ width: '100%' }} size="middle">
            <Alert title="直接点击地图，设置位置~" type="info" showIcon />
            <div className="rowSearch">
                <Select
                    showSearch
                    allowClear
                    value={searchKeywords}
                    placeholder="请输入地址搜索"
                    style={{ width: '100%' }}
                    filterOption={false}
                    onSearch={setSearchKeywords}
                    onChange={selectOnChange}
                    options={searchResultList}
                    fieldNames={{ label: 'title', value: 'id' }}
                />
            </div>
            <div ref={containerRef} id="container" style={{ width: '100%', height: '500px' }} />
        </Space>
    </>
}

const TencentMap = ({ value, onChange }) => {
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [latLng, setLatLng] = useState(null);

    //确认选择的时候
    const confirmChange = () => {
        if (!latLng) {
            message.error('请点击地图选择位置~')
            return false
        }
        onChange(`${latLng.lat},${latLng.lng}`)
        setOpen(false)
    }

    // modal关闭后，清理地图资源
    const afterClose = () => {
        if (map) {
            map.destroy(); // 销毁地图实例（若 API 支持）
            map = undefined;
        }
        markerLayer = undefined;
        geocoder = undefined;
        suggest = undefined;
        infoWindow = undefined;
    };

    return (
        <>
            <Space.Compact
                style={{
                    width: '100%'
                }}
            >
                <Input
                    value={value}
                    readOnly
                    placeholder="请选择位置"
                    suffix={<>
                        <CloseCircleOutlined
                            onClick={() => onChange('')}
                            style={{
                                cursor: 'pointer'
                            }}
                        />
                    </>}
                />
                <Button
                    color="primary"
                    variant="dashed"
                    onClick={() => { 
                        if (!config.tencentApiKey) {
                            return message.error('未设置腾讯地图API KEY')
                        }
                        setOpen(true)
                    }}
                >选择位置</Button>
            </Space.Compact>

            <Modal
                open={open}
                title="选择位置"
                width={800}
                onOk={confirmChange}
                onCancel={() => setOpen(false)}
                destroyOnHidden
                afterClose={afterClose}
            >
                <MapMain value={value} setLatLng={setLatLng} />
            </Modal>
        </>
    );
};

export default TencentMap;