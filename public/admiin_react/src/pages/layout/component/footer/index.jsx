import { Layout } from 'antd';
import { config } from '@/common/config';
const { Footer } = Layout;

/**
 * 后台的页脚
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    return (
        <>
            <Footer style={{ textAlign: 'center', background: 'none', padding: '12px' }}>Copyright © {(new Date()).getFullYear()} {config.company} {config.icp}</Footer>
        </>
    );
};
