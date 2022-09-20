import { Avatar, Button, List, message, Skeleton, Modal, Divider} from 'antd';
import React, { useEffect, useState } from 'react';
import {ContactsOutlined} from '@ant-design/icons';
import "./mytask.css"
import {acceptApplicaton, rejectApplicaton, getAllProject, checkApplicant, projectDetails} from '../../util/request';

const MyTasks = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [list, setList] = useState([]);
  const [renderCount, setRenderCount] = useState(0)



  useEffect(() => {
   getAllProject().then(values =>  {
    values.data.my_projects.map(item => {
        if(item.status === "Recruiting"){
            projectDetails(item.id).then((res) => {
                for(const applicant of res.data.project_detail.applications){
                    console.log(applicant);
                    if(applicant.status === "Pending"){
                        checkApplicant(applicant.applicant_id).then(value => {
                            list.push(Object.assign(applicant, value.data.profile));
                            setList([...list]);
                        })
                        // list.push(applicant);
                        // setList([...list]);
                    }
                }
                // console.log(res.data.project_detail);
            })
        }
    })
    setInitLoading(false);
   }
  )
}, [renderCount])

console.log("###############")
// console.log(applicant);
console.log(list);
console.log("###############")

  console.log(list);
  const handleAccept = async (applicationId) => {
    const res = await acceptApplicaton(applicationId).catch(res => message.error("Repeat operation!"));
    if(res.request.status === 200){
        message.success("You have approved this application!!!")
        setRenderCount(i => i + 1);
        setList([]);
    }else{
        message.error("Repeat operation!")
    }
  }

  const handleReject = async (applicationId) => {
    const res = await rejectApplicaton(applicationId).catch(res => message.error("Repeat operation!"));
    if(res.request.status === 200){
        message.success("You have rejected this application!!!")
        setRenderCount(i => i + 1);
        setList([]);
    }else{
        message.error("Repeat operation!")
    }
  }

  const showModal = (item) => {
    const modal = Modal.success({
        icon: <ContactsOutlined />,
        title: `${item.applicant_name}`,
        content: (
            <div>
                <Avatar className='photo'  src={item.applicant_avatar && `data:image/png;base64,${item.applicant_avatar}`} sx={{width: 80, height: 80 }}/> 
                {item.domain && <p><span style={{fontWeight: "bold",display: "inline-block", marginTop: "1em"}}>Domain</span>: {item.domain}</p>}
                {item.education && <p><span style={{fontWeight: "bold"}}>Education</span>: {item.education} </p>}
                <Divider/>
                {item.bio ? <p><span style={{fontWeight: "bold"}}>Bio</span>: {item.bio}</p> : <p>Hi, I'm {item.applicant_name}.</p>}
            </div>
        ),
      });
  };


  return (
    <>
    <div className="application-list">
        <div className="title">Application list</div>
        <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        // loadMore={loadMore}
        dataSource={list}
        renderItem={(item) => (
            <List.Item
            key={item.application_id}
            actions={[<Button onClick={() => {handleAccept(item.application_id)}}>Accept</Button>, <Button danger onClick={() => {handleReject(item.application_id)}}>Reject</Button>]}
            >
            <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                avatar={<Avatar onClick={() => showModal(item)} className='photo' src={`data:image/png;base64,${item.applicant_avatar}`} />}
                title={<div onClick={() => showModal(item)} className='name'>{item.applicant_name}</div>}
                description={item.applicant_intro}
                />
                <div style={{fontWeight: "600"}}>{item.title}</div>
            </Skeleton>
            </List.Item>
        )}
        />
    </div>
    </>
  );
};

export default MyTasks;