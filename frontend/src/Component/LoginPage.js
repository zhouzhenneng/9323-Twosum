import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoginForm from './LoginForm'
import "./Login&register.css"

export default function LoginPage() {
  return (
    <div className='login-form'>
        <LoginForm/>
    </div>
  )
}
