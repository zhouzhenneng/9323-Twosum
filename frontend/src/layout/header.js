import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HeaderDropDwon from './dropdown'
import './css/header.css'
import { useLocation, useNavigate } from 'react-router-dom';
import { getToken } from '../util/auth';

export default function TwoSumHeader() {
  const navigate = useNavigate()
  const location = useLocation();
  const ProfilePagePath = ['/profile/index', '/profile/chat','/profile/projects','/profile/tasks','/profile/help']
  const token = getToken()
    return (
      <Box sx={{ flexGrow: 1 }} className="header">
        <AppBar position="static" className="navigator" color="transparent"
        sx={{
          'box-shadow': '0px 0px 0px 0px rgba(0,0,0,0.2)'
        }}
        
        >
          <Toolbar>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <div className='logo' onClick={() => {
                if(token.length > 0) {
                  navigate('/home-page')
                } else {
                  navigate('/')
                }
              }}>
              {!ProfilePagePath.includes(location.pathname) &&
              <img src={require('../img/logo.png')} alt="TwoSumLogo" ></img>}
            </div>
            </Typography>
            <HeaderDropDwon login={true}/>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }