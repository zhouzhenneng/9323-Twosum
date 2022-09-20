import React, {useState, useEffect} from 'react'
import './../css/ChatPage.css'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@mui/icons-material/Send';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import MessageSection from './MessageSection';
import { selfprofile } from '../../../util/request';
import { Button } from 'antd';
import { getToken } from '../../../util/auth';


export default function ChatPage() {
  const [send, setSend] = useState(false)
  const [selfProfile, setSelfProfile] = useState('')
  const [fullname, setFullName] = useState('')
  const [sendTo, setSendTo] = useState(0)
  const [userList, setUserList] = useState([])
  const [messages, setMessages] = useState([])
  const [chatWith, setChatWith] = useState({})
  const [loading, setLoading] = useState(false)
  const [repeat, setRepeat] = useState(false)


  const token = getToken()

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
        console.log(data.user_list);
        const reversedList = data.user_list
        const mostRecentUser = reversedList[reversedList.length - 1]
        reversedList.reverse()
        setUserList(reversedList)
        setChatWith(mostRecentUser)
        setSendTo(mostRecentUser.user_id)
      }
    })
    .catch(error => {
      console.log(error);
      alert("could not get chat list")
    })
  }

  const fetchChatHistory = (sendTo) => {
    if(sendTo === 0) return
    setLoading(true)
    const requestOption = {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          token: token
      },
    }
    fetch(`http://127.0.0.1:5000/messages/my_inbox/${sendTo}`, requestOption)
    .then(res => {
      if(res.status === 200){
        return res.json()
      } else {
        throw(res)
      }
    })
    .then(data => {
      const reverseMessages = data.messages
      setMessages(reverseMessages)
      setLoading(false)
    })
    .catch(error => {
      console.log(error);
      alert("could not fetch chat history")
    })
  }

  const fetchEverySeconds = (sendTo) => {
    if(sendTo === 0) return
    const requestOption = {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          token: token
      },
    }
    fetch(`http://127.0.0.1:5000/messages/my_inbox/${sendTo}`, requestOption)
    .then(res => {
      if(res.status === 200){
        return res.json()
      } else {
        throw(res)
      }
    })
    .then(data => {
      const reverseMessages = data.messages
      if (reverseMessages.length === messages.length) return
      setMessages(previous => [...previous, ...(reverseMessages.slice(previous.length))])
    })
    .catch(error => {
      alert("could not fetch chat history")
    })
  }

  

  useEffect(()=>{
    const fetchProfile = async()=>{
        const response = await selfprofile();
        const data = await response.data
        setSelfProfile(data.profile)
        const fullname = `${data.profile.first_name} ${data.profile.last_name}`
        setFullName(fullname)
        console.log(data.profile);
    }
    fetchProfile()
    fetchChatList()
  },[])

  const userOnClick = (user) => {
    console.log(user.user_id);
    setChatWith(user)
    setSendTo(user.user_id)
  }

  useEffect(() => {
    fetchChatHistory(sendTo)
    const interval = setInterval(() => {
      fetchEverySeconds(sendTo)
    }, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [sendTo]);

  return (
     <div className='chat-page'>
      <div className='chat-bottom'>
        <div className='left-chat-list'>
          <List>
            <ListItem button key="RemySharp">
                <ListItemIcon>
                  <Avatar  className='photo' alt={selfProfile && selfProfile.first_name.slice(0,1)} src={selfProfile.avatar && `data:image/png;base64,${selfProfile.avatar}`} sx={{width: 80, height: 80 }} />
                </ListItemIcon>
                <ListItemText primary={fullname}></ListItemText>
            </ListItem>
          </List>
          <Divider />
          <List>
            {userList.map((user) => (
              // user.user_name !== "Jieping Wu" &&
              <ListItem button key={user.user_id} onClick={() => userOnClick(user)}>
                <ListItemIcon>
                    <Avatar alt={user.user_name}  src={user.avatar && `data:image/png;base64,${user.avatar}`} sx={{width: 80, height: 80 }}/>
                </ListItemIcon>
                <ListItemText primary={user.user_name}>{user.user_name}</ListItemText>
              </ListItem>
            ))}
          </List>
        </div>
        {sendTo !== 0 && <MessageSection 
          sendTo={sendTo}
          chatWith={chatWith}
          selfProfile={selfProfile}
          messages={messages}
          setMessages={setMessages} 
          fetchChatHistory={fetchChatHistory} 
          loading={loading}
          repeat={repeat}
        />}
      </div>
    </div>
  )
}
