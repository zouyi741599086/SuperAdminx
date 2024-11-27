import { useState, useEffect } from 'react';
import { Select } from 'antd';
import { useThrottleEffect } from 'ahooks';
import { wordTemplateApi } from '@/api/wordTemplate';
import { useMount } from 'ahooks';

/**
 * 异步搜索选择word模板
 */
export default ({ value, onChange, ...props }) => {
    const [options, setOptions] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [_value, _setValue] = useState();

    useMount(() => {
        //加载列表数据
        getOptions();
    })

    //父组件有值，本组件没值的时候 ajax把下拉数据请求过来
    useEffect(() => {
        if (!_value && value) {
            getOptions({
                id: value
            });
        }
    }, [value])

    const componentChange = (e) => {
        _setValue(e);
        onChange?.(e);
    }

    //搜索节流
    useThrottleEffect(
        () => {
            if (keywords) {
                getOptions({ keywords });
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
    const getOptions = (parmas = {}) => {
        wordTemplateApi.selectWordTemplate(parmas).then(res => {
            setOptions(res.data.map(item => {
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
            placeholder='输入标题搜索'
            filterOption={false}
            onSearch={setKeywords}
            onChange={componentChange}
            options={options}
        />
    </>
}