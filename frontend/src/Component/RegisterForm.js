import React, {useState} from 'react'
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom'
import { Select } from 'antd';
import "./Login&register.css"

const {Option} = Select


export default function RegisterForm() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    const emailRegex = /\S+@\S+\.\S+/
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const onFinish = (values) => {
        console.log('Success:', values);
        const data = {
            "first_name": values.firstname,
            "last_name": values.lastname,
            "email": values.email,
            "role": values.role,
            "domain": values.domain,
            "password": values.password
        }
        const requestOption = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        fetch('http://127.0.0.1:5000/register', requestOption)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw(res)
            }
        })
        .then(data =>{
            console.log(data)
            message.success('Sign up successfully')
            navigate('/login')
        })
        .catch(error => {
            console.log(error);
            alert("register failed")
        })
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const validPassword = (_, value) => {
        if (passwordRegex.test(value)) {
            console.log(value);
            return Promise.resolve()
        }
        return Promise.reject(new Error("at least 8 characters, including uppercase, lowercase and number"));
    }
    const validEmail = (_, value) => {
        if (emailRegex.test(value)) {
            console.log(value);
            return Promise.resolve()
        }
        return Promise.reject(new Error("Please input valid email"));
    }

    const updatePassword = (e) => {
        // console.log(e.target.value);
        setPassword(e.target.value)
    }
    const updatePasswordConfirm = (e) => {
        setPasswordConfirm(e.target.value)
    }
    const passwordMatch = () => {
        if (password === passwordConfirm) {
            return Promise.resolve()
        }
        return Promise.reject(new Error("password does not match")); 
    }
    const goToLogin = () => {
        navigate('/login')
    }
  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        domain: "computer science",
      }}
      
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="First name"
        name="firstname"
        rules={[
          {
            required: true,
            message: 'Please input your first name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Last name"
        name="lastname"
        rules={[
          {
            required: true,
            message: 'Please input your last name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            validator: validEmail
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Role"
        name="role"
        rules={[
          {
            required: true,
            message: 'Please select your role!',
          },
        ]}
      >
        <Select
            style={{
                span: 16,
            }}
            >
            <Option value="student">Student</Option>
            <Option value="mentor">Mentor</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Domain"
        name="domain"
        rules={[
          {
            required: true,
            message: 'Please select your domain!',
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
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            validator: validPassword
          }
        ]}
      >
        <Input.Password onChange={updatePassword}/>
      </Form.Item>

      <Form.Item
        label="Confirm"
        name="password confirm"
        rules={[
          {
            required: true,
            validator: passwordMatch
          },
        ]}
      >
        <Input.Password onChange={updatePasswordConfirm}/>
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
            onClick={goToLogin}
        >
            close
        </Button>
        <Button 
            type="primary" 
            htmlType="submit" 
        >
            Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
