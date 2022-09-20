import React, {useState, useEffect} from 'react';
import { Button, Checkbox, Form, Input, DatePicker, Select, Divider, message, Upload, Modal} from 'antd';
import { Link, useNavigate } from 'react-router-dom'
import './../css/projectform.css'
import {getToken} from './../../../util/auth'
import {UploadOutlined } from '@ant-design/icons';
import {projectDetails} from '../../../util/request'
import { useParams } from 'react-router-dom'
import moment from 'moment';

const {TextArea} = Input
const {Option} = Select
let base64 = "";
export default function EditPorject(){
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const dateFormat = 'YYYY-MM-DD';
  const token = getToken()
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const {project_id} = useParams()

  const [details, setdetails] = useState({})

  const fetchProject= async()=>{
    const result = await projectDetails(project_id);
    setdetails(result.data.project_detail);
    setStart(result.data.project_detail.start_date);
    setEnd(result.data.project_detail.end_date);
  }
  useEffect(() => {
    fetchProject();
  },[]);


  useEffect(()=>{
    form.setFieldsValue({
      ...details,
      //convert a date string to a moment date
      "start": moment(details.start_date, dateFormat),
      "end": moment(details.end_date, dateFormat)
    })
  },[form,details])
  console.log(details)

 
  //upload picture
  const [thumbnailList, setThumbnailList] = useState([]); 


  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  const handleThumbnailChange = async ({ fileList }) => {
    setThumbnailList(fileList);
    const file = fileList[0];
    console.log(file);
    base64 = await getBase64(file.originFileObj);
  };


  const onFinish = async (values) => {
    console.log('Success:', values);
    const data = {
        "title": values.title,
        "category": values.category,
        "company": values.company,
        "start_date": start,
        "end_date": end,
        "location": values.location,
        "description": values.description,
        "video_link": values.video_link,
        "requirement": values.requirement,
        "picture": base64.replace(/^data:image\/[a-z]+;base64,/, ""),
    }
    const requestOption = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify(data)
    }
    fetch(`http://127.0.0.1:5000/myproject/${project_id}`, requestOption)
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
        message.success("Project details update successfully!")
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


  return (
    <div className='porject-form-page'>
        <div className='porject-form'>
        <h1 className='login-title'>Update project details</h1>
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
        form={form}
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
                style={{
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
                // type: 'object',
                required: true,
                message: 'Please chose a start date',
            },
            ]}
        >
            <DatePicker onChange={(value, dateString) => {setStart(dateString)}}/>
        </Form.Item>

        <Form.Item
            label="End"
            name="end"
            rules={[
            {
                // type: 'object',
                required: true,
                message: 'Please chose a end date',
            },
            ]}
        >
            <DatePicker onChange={(value, dateString) => {setEnd(dateString)}}/>
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
            <Input />
        </Form.Item>

        <Form.Item
            label="Video"
            name="video_link"
        >
            <Input placeholder='put video link here'/>
        </Form.Item>

        <Form.Item
            name="thumbnail"
            label="Upload"
            valuePropName="thumbnailList"
            // getValueFromEvent={normFile}
            extra="upload project pictures"
        >
            <Upload 
            listType="picture" 
            fileList={thumbnailList}
            onChange={handleThumbnailChange}
            >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
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
                Republish
            </Button>
        </Form.Item>
        </Form>
        </div>
    </div>
  );
}