import { Button, Form, Input, Select, message} from 'antd';
import React, { useState, useEffect} from 'react';
import {selfprofile, patchGender} from '../../../util/request'
import "../editProfile.css"

export default function EditPerson(){
  const [form] = Form.useForm();
  const { Option } = Select;
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

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    const res = await patchGender(values.gender, values.domain, values.bio);
    if(res.request.status === 200){
      message.success("Successful update personal details!");
      const {gender, domain, bio} = values;
      setprofile(
        {
          ...profile,
          'gender':gender,
          'domain':domain,
          'bio': bio,
        }
      );
    }
  };
  return (
        <div className="details">
          <div className="title">Personal Details</div>
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            onFinishFailed = {onFinishFailed}
          >
            <div className="online gender-filed">
              <Form.Item
                name="gender"
                label={
                  <p style={{fontSize:"16px", fontWeight: "500", display:'inine-block', marginBottom: "5px"}}>Gender</p>
                }
                className="gender"
              >
                <Select
                >
                  <Option value="male">male</Option>
                  <Option value="female">female</Option>
                  <Option value="other">other</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="domain"
                label={
                  <p style={{fontSize:"16px", fontWeight: "500", display:'inine-block', marginBottom: "5px"}}>Domain</p>
                }
                className="Domain"
              >
                <Select
                style={{width: "200px"}}
                >
                  <Option value="computer science">Computer science</Option>
                  <Option value="business">Business</Option>
                  <Option value="engineering">Engineering</Option>
                  <Option value="science">Science</Option>
                  <Option value="medicine">Medicine</Option>
                  <Option value="law">Law</Option>
                  <Option value="arts">Arts</Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item label={
              <p style={{fontSize:"16px", fontWeight: "500", display:'inine-block', marginBottom: "5px"}}>Bio</p>
            } name="bio">
              <Input.TextArea  showCount="true" maxLength="200" autoSize={{minRows: 2, maxRows: 6}} allowClear/>
            </Form.Item>
            <Form.Item >
              <Button type="primary" htmlType="submit" >Update</Button>
            </Form.Item>
          </Form>
        </div>
  )
}