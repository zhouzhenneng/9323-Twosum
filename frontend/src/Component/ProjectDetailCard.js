import React, {useState} from 'react'
import { Card, Space } from 'antd';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './ProjectDetailPage.css'
import MentorProfile from './MentorProfile';

export default function ProjectDetailCard({projectDetail}) {

  return (
    <div className='project-detail-card'>
        <>
            <Card
            title="Project details"
            style={{
                width: 300,
                maxWidth: 600,
            }}
            >
            <div className='project-owner'>
                <Space >
                <PersonIcon/>
                {/* {projectDetail.owner} */}
                <MentorProfile projectDetail={projectDetail}/>
                </Space>
            </div>
            <br></br>
            <div>
                <Space>
                    <BusinessIcon/>
                    {projectDetail.company}
                </Space>
                
            </div>
            <br></br>
            <div>
                <Space> 
                    <CalendarMonthIcon/>
                    {projectDetail.start_date}-{projectDetail.end_date}
                </Space>
            </div>
            <br></br>
            <div>
                <Space>
                    <GroupsIcon/>
                    {projectDetail.category}
                </Space>
            </div>
            <br></br>
            <div>
                <Space>
                    <AccessTimeFilledIcon/>
                    {projectDetail.status}
                </Space>    
            </div>
            <br></br>
            {projectDetail.location && <div>
                <Space>
                    <LocationOnIcon/>
                    {projectDetail.location}
                </Space>
            </div>}
            </Card>
        </>
    </div>
  )
}
