import React from 'react'
import { Button, Dropdown, Menu } from 'antd';
const menu = (
    <Menu
        items={[
        {
            key: '1',
            label: <div>user profile</div>,
        },
        {
            key: '2',
            label: <div onClick={() => console.log("logout !!")}>logout</div>,
        },
        ]}
    />
);

export default function ProfileButton() {
  return (
    <Dropdown overlay={menu} placement="bottomRight" arrow>
        <Button>profile</Button>
    </Dropdown>
  )
}
