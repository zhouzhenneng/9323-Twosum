import { Button, Form, Input, Select, message } from 'antd';
import React, { useState, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import "../editProfile.css"
import {selfprofile, patchPassword} from '../../../util/request'

export default function EditPassword(){
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

  const validPassword = (_, value) => {
    if (passwordRegex.test(value)) {
      console.log(value);
      return Promise.resolve()
    }
    return Promise.reject(new Error("at least 8 characters, including uppercase, lowercase and number"));
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFinish = async (values) => {
    console.log('Received values of form: ', values.confirm);
    const res = await patchPassword(values.confirm);
    if(res.request.status === 200){
      message.success("Successful update password!");
      navigate('/login');
    }
  };

  return (
        <div className="security">
          <div className="title">Security</div>
          <div className="sub-title">Change Password</div>
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            onFinishFailed = {onFinishFailed}
          >
            <Form.Item
              name="old"
              rules={[{ message: 'Please provide your old Password!' }]}
              label={
                <p style={{fontSize:"16px", fontWeight: "500", display:'inine-block', marginBottom: "5px"}}>Current password</p>
              }
            >
              <Input.Password
                placeholder="Old Password"
              />
            </Form.Item>
            <Form.Item
              name="new"
              rules={[
                {validator: validPassword}
              ]
              }
              label={
                <p style={{fontSize:"16px", fontWeight: "500", display:'inine-block', marginBottom: "5px"}}>New password</p>
              }
            >
              <Input.Password
                placeholder="New Password"
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              rules={[
                {
                  message: 'Please confirm your new password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('new') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
              label={
                <p style={{fontSize:"16px", fontWeight: "500", display:'inine-block', marginBottom: "5px"}}>Confirm password</p>
              }
              dependencies={['new']}
            >
              <Input.Password
                placeholder="Confirm New Password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Change Password</Button>
            </Form.Item>
          </Form>
        </div>
  )
}