import { Button, Modal, Input, message } from 'antd';
import React, { useState } from 'react';
import { getToken } from '../util/auth';

const {TextArea} = Input

const FirstMessage = ({showMentorProfile, mentor_id}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newmessage, setNewMessage] = useState('')

  const updateMessage = (e) => {
    console.log(e.target.value);
    setNewMessage(e.target.value)
  }


  const showModal = () => {
    setIsModalVisible(true);
    showMentorProfile(false)
  };

  const handleOk = () => {
    // setIsModalVisible(false);
    const token = getToken()
    console.log("mentor_id:", mentor_id);
    const data = {
        "message": newmessage,
        "receiver_id": mentor_id
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
            message.success("Message sent")
            setIsModalVisible(false);
        } else {
            throw(res)
        }
      })
      .catch(error => {
        console.log(error);
        alert("Message sending failed")
      })

  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button onClick={showModal} type="primary">
        Send your first message
      </Button>
      <Modal visible={isModalVisible} onCancel={handleCancel} footer={
        [
        <Button key="back" onClick={handleCancel}>
            Close
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
            Send
        </Button>
        ]
      }>
        <br></br>
        <TextArea rows={4} placeholder="Send your first message" onChange={updateMessage}/>
      </Modal>
    </>
  );
};

export default FirstMessage;