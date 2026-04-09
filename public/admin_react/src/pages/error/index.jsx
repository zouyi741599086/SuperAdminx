import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';

/**
 * 404
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
const Error = () => {
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
                        navigate('/')
                    }}
                >返回首页</Button>
            }
        />
    )
};

export default Error;