import { Button, Form, Input, Select, message} from 'antd';
import React, { useState, useEffect} from 'react';
import {selfprofile, patchName} from '../../../util/request'
import "../editProfile.css"


export default function AccountForm(){
  // message.success("hello");
  const [form] = Form.useForm();

  const [profile, setprofile] = useState({})

  const fetchProfile = async()=>{
    const result = await selfprofile();
    setprofile(result.data.profile);
  }
  useEffect(() => {
    fetchProfile();
  },[]);

  useEffect(()=>{
    form.setFieldsValue({
      ...profile,
    })
  },[form,profile])
  console.log(profile)

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    const res = await patchName(values.first_name, values.last_name);
    // console.log(res.request.status);
    if(res.request.status === 200){
      message.success("Successful update account details!");
      const {first_name, last_name} = values;
      setprofile(
        {
          ...profile,
          "first_name": first_name,
          "last_name": last_name,
        }
      );
    }
  };


  return (
        <div className="account">
          <div className="title setting">Account Setting</div>
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              onFinishFailed = {onFinishFailed}
              autoComplete="off"
            >
            <div className="online name">
              <Form.Item label={
                <p style={{fontSize:"16px", fontWeight: "500", display:'inine-block', marginBottom: "5px"}}>First Name</p>
              } className="first" name="first_name" >
                <Input />
              </Form.Item>
              <Form.Item label={
                <p style={{fontSize:"16px", fontWeight: "500", display:'inine-block', marginBottom: "5px"}}>Last Name</p>
              } className="last" name="last_name">
                <Input  />
              </Form.Item>
            </div>
              <Form.Item label={
                <p style={{fontSize:"16px", fontWeight: "500", display:'inine-block', marginBottom: "5px"}}>Email</p>
              } name="email">
                <Input  disabled/>
              </Form.Item>
            <Form.Item >
              <Button type="primary" htmlType="submit">Update</Button>
            </Form.Item>
          </Form >
        </div>
  )
}