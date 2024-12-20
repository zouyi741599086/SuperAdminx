import { useState } from 'react';
import { Cascader } from 'antd';
import { useMount } from 'ahooks';
import { regionApi } from '@/api/region';

/**
 * 省市区选择
 * @param {string} value 默认值
 * @param {fun} onChange 修改value事件
 * @param {string} valueType 返回的value值是要id还是要title
 * @param {boolean } changeOnSelect 是否可直接选择某个省、或某个市，而不是必须要选择省》市》区
 * @param {boolean } multiple 是否支持多选
 * @param {string } expandTrigger 次级菜单的展开方式，可选 'click' 和 'hover'
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ value, onChange, valueType = 'title', changeOnSelect = false, multiple = false, expandTrigger = 'hover',...props }) => {
    const [list, setList] = useState([]);
    useMount(() => {
        regionApi.getListAll().then(res => {
            setList(res.data);
        })
    })

    return (
        <>
            <Cascader
                value={value}
                onChange={(_value) => {
                    onChange(_value);
                }}
                changeOnSelect={changeOnSelect}
                maxTagCount="responsive"
                multiple={multiple}
                options={list}
                placeholder="请选择，支持搜索"
                allowClear
                fieldNames={{
                    label: 'title',
                    key: 'id',
                    value: valueType,
                    children: 'children'
                }}
                showSearch={true}
                expandTrigger={expandTrigger}
                style={{
                    width: '100%'
                }}
            />
        </>
    )
}
