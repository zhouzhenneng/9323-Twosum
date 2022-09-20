import React, {useState, useEffect} from 'react'
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
import './../css/ChatPage.css'
import { useParams } from 'react-router-dom';
import { getToken } from '../../../util/auth';
import CircularProgress from '@mui/material/CircularProgress';


export default function MessageSection({sendTo, chatWith, selfProfile, messages, setMessages, fetchChatHistory, loading, repeat}) {
  const [newMessage, setNewMessage] = useState('')
  const [send, setSend] = useState(false)

  const updateNewMessage = (e) => {
    setNewMessage(e.target.value)
  }

  const onSend = () => {
    if (newMessage.length === 0) return
    const token = getToken()
    const data = {
        "message": newMessage,
        "receiver_id": chatWith.user_id
    }
    const requestOption = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            token: token
        },
        body: JSON.stringify(data)
    }
    fetch("http://127.0.0.1:5000/messages/new", requestOption)
    .then(res => {
        if(res.status === 200){
            setNewMessage("")
            setSend(!send)
            // fetchChatHistory(chatWith.user_id)
            setMessages(previous => [...previous, {
                message: newMessage,
                receiver_avatar: chatWith.avatar,
                receiver_id: chatWith.user_id,
                receiver_name: chatWith.user_name,
                sender_avatar: selfProfile.avatar,
                sender_id: selfProfile.id,
                sender_name: selfProfile.first_name + selfProfile.last_name,
                sent_time: new Date().toISOString().split('T')[1].split('.')[0]
            }])
            pageScroll()
        } else {
            throw(res)
        }
    })
    .catch(error => {
        alert("Message sending failed")
    })

  }

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      onSend()
    }
  }

  useEffect(() => {
    pageScroll()
  }, [send])

  const pageScroll = () => {
    const elem = document.getElementById('message-container');
    elem.scrollTop = elem.scrollHeight;
  }
    
  return (
    !loading ? <div className='right-chat-box'>
          <div className='chat-header'>{chatWith.user_name}</div> 
          <Divider/> 
          <div id='message-container'>       
            <List >
              {messages.map((data, index) => (    
                  <ListItem key={index} >
                    {data.sender_id !==  selfProfile.id &&
                      <ListItemAvatar>
                      <Avatar className='photo'  src={chatWith.avatar && `data:image/png;base64,${chatWith.avatar}`} sx={{width: 90, height: 90 }}/>
                      </ListItemAvatar>
                    }
                    <Grid container style={{marginRight: "10px"}}>
                        <Grid item xs={12}>
                            <ListItemText align={data.sender_id ===  selfProfile.id ? "right" : "left"} primary={data.message}></ListItemText>
                        </Grid>
                        <Grid item xs={12}>
                            <ListItemText align={data.sender_id ===  selfProfile.id ? "right" : "left"} secondary={data.sent_time.includes(',') ? data.sent_time?.split(',')[1]?.replaceAll('-', ':') : data.sent_time}></ListItemText>
                        </Grid>
                        
                    </Grid>
                    {data.sender_id ===  selfProfile.id &&
                      <ListItemAvatar>
                        <Avatar className='photo'  src={selfProfile.avatar && `data:image/png;base64,${selfProfile.avatar}`} sx={{width: 90, height: 90 }}/> 
                      </ListItemAvatar>
                    }
                </ListItem>
              ))}
            </List>
          </div>
          <Divider />
          <div className='input-area'>
              <Grid container style={{padding: '20px'}}>
                  <Grid item xs={11}>
                      <TextField 
                        id="outlined-basic-email" 
                        label="Send message" 
                        fullWidth 
                        onChange={updateNewMessage} 
                        value={newMessage}
                        onKeyDown={handleEnter}
                      />
                  </Grid>
                  <Grid item xs={1} align="right">
                      <Fab color="primary" aria-label="add" onClick={onSend}><SendIcon /></Fab>
                  </Grid>
              </Grid>
          </div>
    </div>
    :
    <div className='loading-container'>
        <CircularProgress />
        {/* loading... */}
    </div>
  )
}
