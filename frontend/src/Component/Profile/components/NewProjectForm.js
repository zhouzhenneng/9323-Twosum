import React, {useState} from 'react';
import { Button, Checkbox, Form, Input, DatePicker, Select, Divider, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom'
import './../css/projectform.css'
import {getToken} from './../../../util/auth'

const {TextArea} = Input
const {Option} = Select

const NewProjectForm = () => {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const token = getToken()
  const navigate = useNavigate()
  const onFinish = (values) => {
    console.log('Success:', values);
    console.log(values.start.dateString);
    const data = {
        "title": values.title,
        "category": values.category,
        "company": values.company,
        "start_date": start,
        "end_date": end,
        "location": values.location,
        "description": values.description,
        "video_link": values.video,
        "requirement": values.requirement,
    }
    const requestOption = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(data)
    }
    fetch("http://127.0.0.1:5000/myproject/create", requestOption)
    .then(res => {
        if(res.status === 200) {
            return res.json()
        } else {
            throw(res)
        }
    })
    .then(data => {
        console.log(data);
        navigate('/profile/index')
        message.success("New peoject published successfully!")
    })
    .catch(error => {
        console.log(error);
        alert("publish failed")
    })

  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const goBack = () => {
    navigate('/profile/index')
  }

  const disabledDate = (current) => {
    const dateFormat = current.toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    return dateFormat < today
  }


  return (
    <div className='porject-form-page'>
    <div className='porject-form'>
    <h1 className='login-title'>Create a new project</h1>
    {/* <Divider/> */}
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[
          {
            required: true,
            message: 'Please input a title',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Category"
        name="category"
        rules={[
          {
            required: true,
            message: 'Please select a category',
          },
        ]}
      >
        <Select
            // defaultValue="computer science"
            style={{
                // width: 120,
                span: 16,
            }}
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

      <Form.Item
        label="Company"
        name="company"
        rules={[
          {
            required: true,
            message: 'Please input company',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Start"
        name="start"
        rules={[
          {
            required: true,
            message: 'Please chose a start date',
          },
        ]}
      >
        <DatePicker onChange={(value, dateString) => {setStart(dateString)}} disabledDate={disabledDate}/>
      </Form.Item>

      <Form.Item
        label="End"
        name="end"
        rules={[
          {
            required: true,
            message: 'Please chose a end date',
          },
        ]}
      >
        <DatePicker onChange={(value, dateString) => {setEnd(dateString)}} disabledDate={disabledDate}/>
      </Form.Item>

      <Form.Item
        label="Location"
        name="location"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Requirement"
        name="requirement"
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Video"
        name="video"
      >
        <Input placeholder='put video link here'/>
      </Form.Item>


      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button 
            htmlType="button"
            style={{
                margin: '0 8px',
            }}
            onClick={goBack}
        >
            Close
        </Button>
        <Button type="primary" htmlType="submit">
            Publish
        </Button>
      </Form.Item>
    </Form>
    </div>
    </div>
  );
};

export default NewProjectForm;