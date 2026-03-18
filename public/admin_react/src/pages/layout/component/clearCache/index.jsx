import {
    ClearOutlined
} from '@ant-design/icons';
import { Tooltip, Popconfirm, App } from 'antd';
import { adminIndexApi } from '@/api/adminIndex';

/**
 * 清除缓存
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
const ClearCache = ({ placement, ...props }) => {
    const { message } = App.useApp();

    const clearCache = () => {
        adminIndexApi.clearCache().then((res) => {
            if (res.code === 1) {
                message.success(res.message)
            } else {
                message.error(res.message)
            }
        });
    }

    return <>
        <div className='item'>
            <Tooltip title="删除缓存" placement={placement}>
                <Popconfirm
                    title="确认要删除所有缓存吗？"
                    onConfirm={() => {
                        clearCache();
                    }}
                >
                    <span className='circle'>
                        <ClearOutlined />
                    </span>
                </Popconfirm>
            </Tooltip>
        </div>
    </>;
};

export default ClearCache;