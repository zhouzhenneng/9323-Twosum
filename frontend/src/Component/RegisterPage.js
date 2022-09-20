import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RegisterForm from './RegisterForm'
import "./Login&register.css"

export default function RegisterPage() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    const navigate = useNavigate()
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [role, setRole] = useState('student')
    const [background, setBackgound] = useState('')
    const [domain, setDomain] = useState('computer science')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [informationCorrect, setInformationCorrect] = useState(true)

    const emailUpdate = (e) => {
        setEmail(e.target.value)
    }
    const passwordUpdate = (e) => {
        setPassword(e.target.value)
    } 
    const passwordConfirmUpdate = (e) => {
        setPasswordConfirm(e.target.value)
    } 
    const roleUpdate = (e) => {
        setRole(e.target.value)
    }
    const firstnameUpdate = (e) => {
        setFirstname(e.target.value)
    }
    const lastnameUpdate = (e) => {
        setLastname(e.target.value)
    }
    const backgroundUpdate = (e) => {
        setBackgound(e.target.value)
    }
    const domainUpdate = (e) => {
        setDomain(e.target.value)
    }

    const checkEmail = (e) => {
        const emailRegex = /\S+@\S+\.\S+/
        if (!emailRegex.test(email)) {
            alert("email is not valid")
            return
        }
    }
    const registerOnclick = () => {
        if (!passwordRegex.test(password)) {
            alert("password format is not valid")
            return
        }
        if (password !== passwordConfirm) {
            alert("password does not match")
            return
        }
        if (informationCorrect) {
            // alert("successful")
            navigate('/login')
        }
    }

  return (
    <div className='register-form'>
        <h1 className='register-title'>Register</h1>
        <RegisterForm/>
    </div>
  )
}
