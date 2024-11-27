import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

/**
 * 404
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default () => {
    const navigate = useNavigate();
    return (
        <Result
            status="404"
            title="404"
            subTitle="页面不见了~"
            extra={
                <Button
                    type="primary"
                    onClick={() => {
                        navigate('/index')
                    }}
                >返回首页</Button>
            }
        />
    )
};