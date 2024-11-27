import {
    ExpandOutlined
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { useFullscreen } from 'ahooks'

/**
 * 全屏按钮
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ placement = 'top' }) => {
    const [_, { toggleFullscreen }] = useFullscreen(document.body);

    return (
        <div className='item'>
            <Tooltip title="全屏，可按`F11`" placement={placement}>
                <span className='circle' onClick={toggleFullscreen}>
                    <ExpandOutlined className='icon' />
                </span>
            </Tooltip>
        </div>
    );
};
