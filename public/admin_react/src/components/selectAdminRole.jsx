import { useState, useEffect } from 'react';
import { Select, Pagination, Divider } from 'antd';
import { useThrottleEffect } from 'ahooks';
import { adminRoleApi } from '@/api/adminRole';
import { useMount } from 'ahooks';

/**
 * 管理员角色 异步搜索选择
 *
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 * */
export default ({ value, onChange, ...props }) => {
    const [options, setOptions] = useState([]);
    const [keywords, setKeywords] = useState();
    const [_value, _setValue] = useState();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(20); // 每页默认条数

    useMount(() => {
        // 加载列表数据
        getOptions();
    })

    // 父组件有值，本组件没值的时候 ajax把下拉数据请求过来
    useEffect(() => {
        if (!_value && value) {
            // 如果有值，可能是多选，那么每页显示条数及读取的条数必须大于等于当前值的条数
            setTimeout(() => {
                let _pageSize = value.length > pageSize ? value.length : pageSize;
                getOptions({
                    page: 1,
                    pageSize: _pageSize,
                    id: value
                });
            }, 500);
        }
    }, [value])

    // 改变父组件及本组件的值
    const componentChange = (e) => {
        _setValue(e);
        onChange?.(e);
    }

    // 搜索节流
    useThrottleEffect(
        () => {
            if (keywords) {
                getOptions({
                    keywords,
                    page: 1
                });
            } else {
                getOptions();
            }
        },
        [keywords],
        {
            wait: 500,
        },
    );

    ///////////开始搜索/////////////////
    const getOptions = (params = {}) => {
        setLoading(true);
        setPage(params.page || 1);
        if (params.pageSize && params.pageSize > pageSize) {
            setPageSize(params.pageSize);
        }
        adminRoleApi.selectAdminRole({
            ...params,
            pageSize: params.pageSize || pageSize,
        }).then(res => {
            setLoading(false);
            setTotal(res.data?.total);
            setOptions(res.data?.data?.map(item => {
                return {
                    value: item.id,
                    label: `${item.title}`,
                }
            }));
        });
    }

    return <>
        <Select
            showSearch
            allowClear
            value={value}
            placeholder='输入角色名称搜索'
            // 是否可以多选
            // mode="multiple"
            // 多选时做多显示多少个tag：number | responsive
            // maxTagCount="responsive"
            filterOption={false}
            onSearch={setKeywords}
            onChange={componentChange}
            options={options}
            loading={loading}
            style={{
                width: '100%'
            }}
            popupRender={menu => <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <div
                    style={{ paddingBottom: '4px' }}
                >
                    <Pagination
                        align='end'
                        pageSize={pageSize}
                        current={page}
                        total={total}
                        showSizeChanger={false}
                        simple={{ readOnly: true }}
                        onChange={(page) => {
                            getOptions({
                                keywords,
                                page,
                            });
                        }}
                    />
                </div>
            </>}
        // 自定义渲染每一行
        // optionRender={e => {
        // }}
        />
    </>
}