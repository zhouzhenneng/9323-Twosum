import { Button, Form, Input, Select, message } from 'antd';
import React, { useState, useEffect} from 'react';
import {selfprofile, patchBackground} from '../../../util/request'
import "../editProfile.css"

export default function EditBackground(){
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

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    const res = await patchBackground(values.education, values.company);
    if(res.request.status === 200){
      message.success("Successful update background details!");
      const {education, company} = values;
      setprofile(
        {
          ...profile,
          'education':education,
          'company':company,
        }
      );
    }
  };



  return (
        <div className="background">
          <div className="title">Background Details</div>
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              onFinishFailed = {onFinishFailed}
            >
            <div className="online uni-company">
              <Form.Item label={
                <p style={{fontSize:"16px", fontWeight: "500", display:'inine-block', marginBottom: "5px"}}>Education</p>
              } className="Education" name="education">
                <Input  value={profile.education}/>
              </Form.Item>
              {!profile.is_student &&
              <Form.Item label={
                <p style={{fontSize:"16px", fontWeight: "500", display:'inine-block', marginBottom: "5px"}}>Company</p>
              } className="company" name="company">
                <Input  value={profile.company} />
              </Form.Item>
              }
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit">Update</Button>
            </Form.Item>
          </Form >
        </div>
  )
}