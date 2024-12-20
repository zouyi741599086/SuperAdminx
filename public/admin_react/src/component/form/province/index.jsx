import { useState } from 'react';
import { Select } from 'antd';
import { regionApi } from '@/api/region';
import { useMount } from 'ahooks';

/**
 * 省选择
 * @param {String} value 默认值
 * @param {fun} onChange 修改value事件
 * @param {String} valueType 返回的value值是要id还是要title
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ value, onChange, valueType = 'title', ...props }) => {
    const [list, setList] = useState([]);
    useMount(() => {
        regionApi.getProvince().then(res => {
            setList(res.data);
        })
    })
    return (
        <>
            <Select
                value={value}
                onChange={(_value) => {
                    onChange(_value);
                }}
                placeholder="请选择，支持搜索"
                options={list}
                allowClear
                fieldNames={{
                    label: 'title',
                    value: valueType
                }}
                showSearch={true}
                style={{
                    width: '100%'
                }}
            />
        </>
    )
}
