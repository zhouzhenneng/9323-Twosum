
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
// import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';

import NotificationsIcon from '@mui/icons-material/Notifications';
import './css/dropdown.css'
import {removeToken, getToken} from './../util/auth'
import { useNavigate } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';


export default function HeaderDropDwon(props) {
  const navigate = useNavigate()  
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toprofile = () => {
    handleClose()
    navigate("/profile/index")
  };

  const logout = () => {
    handleClose()
    removeToken()
    console.log("logout");
    navigate("/login")
  }
  const onClick = ({key}) => {
    if (key === '0') {
      toprofile()
      return
    }
    if (key === '1') {
      logout()
      return
    }
  }
  
  const menu = (
    <Menu
      onClick={onClick}
      items={[
        {
          label: "My account",
          key: '0',
        },
        {
          label: "Logout",
          key: '1',
        },
      ]}
    />
  );
  return (
    <>
    {getToken() && (
          <div>
            <Dropdown overlay={menu} trigger={['click']}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <PersonIcon sx={{ color: "black" }}/>
              </Space>
            </a>
          </Dropdown>
          </div>
        )}
    </>
  );
}