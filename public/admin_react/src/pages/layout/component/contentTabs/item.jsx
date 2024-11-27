import { theme } from 'antd';
import {
    CloseOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const { useToken } = theme;

export default ({ title, name, close, path, closePage, activeName, ...props }) => {
    const { token } = useToken();
    const navigate = useNavigate();

    return <div
        className={`tabs-pane-btn ${activeName === name ? 'on' : ''}`}
        style={activeName === name ? { background: token.colorPrimary } : {}}
        onClick={() => {
            navigate(path);
        }}
    >
        <span>{title}</span>
        {close ? <>
            <span
                className="icon"
                onClick={(e) => {
                    closePage(name);
                    e.stopPropagation();
                }}
            >
                <CloseOutlined style={{ marginRight: '0px', marginLeft: '5px' }} />
            </span>
        </> : ''}
    </div>
}
