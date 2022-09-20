import React from 'react';
import  AccountForm from "./edit_Component/account"
import EditPerson from "./edit_Component/personal"
import EditBackground from "./edit_Component/background"
import EditPassword from "./edit_Component/security"
import { Button } from 'antd';
import {useNavigate } from 'react-router-dom'



export default function EditProfile(){
  const navigate = useNavigate()
  const goBackProfile = () => {
    navigate('/profile/index')
  }
  return (
    <>
      <div className="goBack">
        <div className='content'>
          <p style={{fontWeight: "bold", fontSize: "25px"}}>Your Twosum profile</p>
          <p>Impress recruiters by showing them the <span style={{fontWeight: "bold"}}>real</span> work</p>
          <Button type="primary" onClick={goBackProfile}>View My Profile {'>>'} </Button>
        </div>
      </div>
      <div className="profile-container">
        <AccountForm />
        <EditPerson />
        <EditBackground />
        <EditPassword />
      </div>  
    </>
  )
}