import React, {useState, useEffect, useRef} from 'react'
import './../Component/ProjectDetailPage.css'
import ProjectDetailCard from './ProjectDetailCard'
import { Button, Modal, Input, message, Divider, Empty} from 'antd';
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom'
import {applyProject, } from "../util/request"

export default function ProjectDetailPage() {
  const [projectDetail, setProjectDetail] = useState({})
  const [messages, setMessage] = useState('');
  const {project_id} = useParams()
  console.log(project_id);

  //applying modal  
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const { TextArea } = Input;

  const showModal = () => {
    setVisible(true);
  };
  const handleMessageChange =  (event) => {
    // 👇️ access textarea value
    setMessage(event.target.value);
  };

  const handleOk = async (e) => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
      //clear textarea value
      setMessage("");
    }, 1000);
    const res = await applyProject(messages, project_id).catch(error => {
      console.log(error);
      message.error("Error you have already applied for this project!")
    });

    if(res.request.status === 200){
      message.success("Successful send this application!!");
    }
  };

  const handleCancel = (event) => {
    console.log('Clicked cancel button');
    setMessage("");
    setVisible(false);
  };


  const getProjectDetail = () => {
    const requestOption = {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
      },
    }
    fetch(`http://127.0.0.1:5000/published_project/${project_id}`, requestOption)
    .then(res => {
        if(res.status === 200) {
            return res.json()
        } else {
            throw(res)
        }
    })
    .then(data => {
      console.log(data.project_detail);
      setProjectDetail(data.project_detail)
    })
    .catch(error => {
      console.log(error);
      alert(error)
    })
  }

  useEffect(() => {
    getProjectDetail()
  }, [])

  return (
    <div>
        <div className='project-container'>
            <div className='project-container-left'>
              <div className='company-name'>
                <h1>{projectDetail.company}</h1>
                <h1>{projectDetail.title}</h1>
                {localStorage.getItem("role") === "student" && projectDetail.status === "Recruiting" &&
                  <>
                    <Button size='large' type='primary' onClick={showModal} shape="round">Apply now!</Button>
                    <Modal
                    title="A brief introduction"
                    visible={visible}
                    onOk={handleOk}
                    okText="Apply"
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    >
                      <TextArea value={messages} onChange={handleMessageChange}  rows={4}  maxLength={200} showCount allowClear />
                  </Modal>
                  </>
                }
              </div>
            </div>
            <div className='project-container-right'>
              <ProjectDetailCard projectDetail={projectDetail}/>
            </div>
        </div>
            <Divider/>
        <div className='second-part'>
            <div className='second-part-text'>
                {projectDetail.description? 
                  <>
                    <h4>Description</h4>
                    <p className='details_text'>{projectDetail.description}</p>
                  </>
                  : <Empty description="No Project Description"/>
                }
                {projectDetail.requirement && 
                  <>
                    <h4>Requirement</h4>
                    <p>{projectDetail.requirement}</p>
                  </>
                }
            </div>
            <br></br>
            <div className='video-container'>
              {projectDetail.video_link? <ReactPlayer url={projectDetail.video_link} controls/> : <Empty description="No Video"/>}
            </div>
        </div>
    </div>
  )
}
