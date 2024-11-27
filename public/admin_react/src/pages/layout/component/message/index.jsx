import {
    BellOutlined,
} from '@ant-design/icons';
import { Badge, Dropdown } from 'antd';
import { NavLink } from 'react-router-dom';
import './index.css'

/**
 * 后台消息提示
 * 
 * @author zy <741599086@qq.com>
 * @link https://www.superadminx.com/
 */
export default ({ placement = 'bottomRight' }) => {
    return <>
        {/* <Dropdown
      placement={placement}
      autoAdjustOverflow={false}
      menu={{
        items: [
          {
            label: (
              <NavLink to="/index">
                <div className='message-item'>
                  <span>提现待审核</span>
                  <Badge count={25} size="small" />
                </div>
              </NavLink>
            ),
            key: '0',
          },
          {
            label: (
              <NavLink to="/index">
                <div className='message-item'>
                  <span>待退款订单</span>
                  <Badge count={25} size="small" />
                </div>
              </NavLink>
            ),
            key: '1',
          }
        ]
      }}
    >
      <div className='item'>
        <Badge size="small" count={5}>
          <span className='circle'><BellOutlined className='icon' /></span>
        </Badge>
      </div>
    </Dropdown> */}
    </>;
};
