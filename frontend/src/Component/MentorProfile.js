import { Button, Modal, Divider, Rate, List, Skeleton } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import { Avatar } from '@mui/material';
import { getToken } from '../util/auth';
import { Link } from 'react-router-dom';
import { selfprofile } from '../util/request';
import FirstMessage from './FirstMessage';
import { getisStudent } from '../util/auth';
import { useNavigate } from 'react-router-dom';
import {getFeedback} from '../util/request'

const MentorProfile = ({projectDetail}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profile, setProfile] = useState({})
  const [canSend, setCanSend] = useState(true)
  const [list, setList] = useState([]);
  const [averageRate, setAverageRate] = useState(0)
  const token = getToken()
  const navigate = useNavigate()
 
  const showModal = () => {
    setIsModalVisible(true);
    getProfile()
    fetchChatList()
    getFeedback(projectDetail.owner_id).then(res => {
      console.log(averageRate);
      console.log("rating: ",res);
      let rate = 0
      res.data.reviews.map(rating => {
        rate += rating.rating
      })
      setAverageRate(Math.ceil(rate / res.data.reviews.length))
      setList(res.data.reviews)
    })
  };



  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchChatList = () => {
    const requestOption = {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          token: token
      },
    }
    fetch("http://127.0.0.1:5000/messages/my_inbox/user_list", requestOption)
    .then(res => {
      if(res.status === 200){
        return res.json()
      } else {
        throw(res)
      }
    })
    .then(data => {
      if (data.user_list.length > 0) {
        console.log("chat list:", data.user_list);
        data.user_list.map(user => {
            if(user.user_id === parseInt(projectDetail.owner_id)) {
                setCanSend(false)
            }
        })
      }
    })
    .catch(error => {
      console.log(error);
      alert("could not get chat list")
    })
  }

  const getProfile = () => {
    const token = getToken()
    const requestOption = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            token: token
        },
        }
        fetch(`http://127.0.0.1:5000/profile/${projectDetail.owner_id}`, requestOption)
        .then(res => {
            if(res.status === 200) {
                return res.json()
            } else {
                throw(res)
            }
        })
        .then(data => {
            console.log(data.profile);
            setProfile(data.profile)
        })
        .catch(error => {
            console.log(error);
            alert("Cound not get personal information of this memtor")
        })
    }

    const goToChat = () => {
        navigate('/profile/chat')
    }

  return (
    <>
      <div onClick={showModal}>{projectDetail.owner}</div>
      <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null} width={1000}>
        <Avatar className='photo'  src={profile.avatar && `data:image/png;base64,${profile.avatar}`} sx={{width: 80, height: 80 }}> 
        </Avatar>
        <br></br>
        <p>{profile.first_name} {profile.last_name}</p>
        <Rate disabled value={averageRate} />
        {profile.education && <p>Education: {profile.education} </p>}
        {profile.company && <p>Company: {profile.company}</p>}
        {/* <Divider/> */}
        <br></br>
        <br></br>
        {(getisStudent() && canSend) && <FirstMessage showMentorProfile={setIsModalVisible} mentor_id={projectDetail.owner_id}/>}
        {(getisStudent() && !canSend) && <Button type='primary' onClick={goToChat}>Chat now</Button>}
        <Divider/>
        <>
        <div className="application-list">
            <div className="title">Comments</div>
            <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={list}
            renderItem={(item) => (
                <List.Item
                key={item.reviewer_id}
                actions={[<Rate disabled defaultValue={item.rating} />]}
                >
                <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                    avatar={<Avatar src={`data:image/png;base64,${item.reviewer_avatar}`} />}
                    title={<a >{item.reviewer_name}</a>}
                    description={item.comments}
                    />
                    <div style={{fontWeight: "600"}}>{item.review_project}</div>
                </Skeleton>
                </List.Item>
            )}
            />
        </div>
        </>
      </Modal>
    </>
  );
};

export default MentorProfile;