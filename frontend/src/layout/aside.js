import * as React from 'react';
import './css/aside.css'
// import Link from '@mui/material/Link';
import { Link } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ChatIcon from '@mui/icons-material/Chat';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate, useLocation } from 'react-router-dom';
import { getisStudent } from '../util/auth';
export default function Aside(){
    const navigate = useNavigate()
    const toHomePage = () => {
        navigate('/home-page')
    }
    const regexnum = /^[0-9]+$/
    const location = useLocation()
    const arr = location.pathname.split('/')
    const user_id = arr[arr.length - 1]
    const chatPageKeepSame = regexnum.test(user_id)
  
    return (
        <div className='Aside'>
            
        <div className='asidelogo' onClick={toHomePage}>
              
              <img src={require('../img/logo.png')} alt="TwoSumLogo" ></img>
        </div>

        <div className='profileLink'>
            <AccountBoxIcon />
            <div>
                <Link to={'profile/index'} underline="none" style={{color: "white", fontSize: "15px"}}>
                    Profile
                </Link>
            </div>
        </div>
        <div className='profileLink'>
            <ChatIcon />
            <div>
                {!chatPageKeepSame && <Link to={'profile/chat'} underline="none" style={{color: "white", fontSize: "15px"}}>
                    Chat
                </Link>}
                {chatPageKeepSame && <Link to={`profile/chat/${user_id}`} underline="none" style={{color: "white", fontSize: "15px"}}>
                    Chat
                </Link>}
            </div>
        </div>

        <div className='profileLink'>
            <FolderIcon />
            <div>
                <Link to={'profile/projects'} underline="none" style={{color: "white", fontSize: "15px"}}>
                    Projects
                </Link>
            </div>
        </div>
        { !getisStudent() &&
            <div className='profileLink'>
                <AssignmentIcon />
                <div>
                    <Link to={'profile/tasks'} underline="none" style={{color: "white", fontSize: "15px"}}>
                    Request
                    </Link>
                </div>
            </div>
        }
        <div className='profileLink'>
            <HelpOutlineIcon />
            <div>
                <Link to={'profile/help'} underline="none" style={{color: "white", fontSize: "15px"}}>
                    Help
                </Link>
            </div>
        </div>


        </div>
     );
}