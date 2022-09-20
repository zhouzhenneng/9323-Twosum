import {selfprofile} from '../../../util/request'
import React, {useState,useEffect} from 'react'
import { Button,Modal, message, Upload, List,  Skeleton, Rate } from 'antd'
import './../css/projectform.css'
import "./../css/index.css"
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import { getisStudent } from '../../../util/auth';
import {uploadPhoto, getFeedback} from '../../../util/request'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import ImgCrop from 'antd-img-crop';

let base64 = "";
let userId = -1;
function Profileindex() {
  const [profile, setprofile] = useState({})
  const [loading, setloading] = useState(true)
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);
    // upload photo
  const [fileList, setFileList] = useState([]);
  const [renderCount, setRenderCount] = useState(0)
  const [list, setList] = useState([]);


  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const onChange = async ({ fileList}) => {
    setFileList(fileList);
    const file = fileList[0];
    console.log(file);
    base64 = await getBase64(file.originFileObj)
  };

  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
    //   model
  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = (event) => {
    console.log('Clicked cancel button');
    setVisible(false);
    setFileList([]);
  };

  const handleOk = async () => {
    const res = uploadPhoto(base64.toString().replace(/^data:image\/[a-z]+;base64,/, ""));
    res.then(value => {
        if(value.status === 200){
            message.success("Successfully update your profile photo!!")
            setRenderCount(i => i + 1)
        }else{
            message.error("Failed to updata, please check it again!!")
        }
    })
    setVisible(false);
    setFileList([]);
  }

  const handleMouseOver = () => {
    setIsHovering(true);
  };

 
  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const navigate = useNavigate()
                                    
  useEffect(()=>{
    const fetchProfile = async()=>{
        const result = await selfprofile();
        setprofile(result.data.profile)
        setloading(false)
        userId = result.data.profile.id;
        getFeedback(userId).then(res => {
            setList(res.data.reviews)
        })
        console.log(result.data.profile)
        console.log(!Object.keys(profile).length===0)
    }
    fetchProfile()
  },[renderCount])

  return (
    <>
    {/* <div className='index-containers'> */}
    <div className='index-containers'>
        {!loading && <>
    <div className='totalProfile'>  
        <div className='leftProfile'>
            <div className='Avator'  onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onClick={showModal}>
                {profile.avatar ? 
                    <Avatar className='photo' alt={profile.first_name.slice(0,1)} src={`data:image/png;base64,${profile.avatar}`} sx={{width: 90, height: 90 }}> 
                    </Avatar>
                    : <Avatar sx={{ bgcolor: deepOrange[500],width: 90, height: 90 }}>
                        {isHovering? <span className='upload' style={{position: "absolute", left: "10px", top:"32px"}}> Upload Photo </span>: <span>{profile.first_name.slice(0,1)}</span>}
                    </Avatar> }
                    {(isHovering && profile.avatar)&& <span className='upload'> Upload Photo </span>}
            </div>
            <Modal
                title="Update your profile picture"
                visible={visible}
                onOk={handleOk}
                okText="Apply"
                onCancel={handleCancel}
                >
                <ImgCrop rotate>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                    >
                        {fileList.length < 1 && '+ Upload'}
                    </Upload>
                </ImgCrop>
            </Modal>

            <div id='Name'>
                <p>{profile.first_name+' '+profile.last_name}</p>
            </div>
            
            <div id='University'>
                <p>{profile.education && profile.education}</p>
            </div>      
            

            <Link underline="none" to='/profile/edit'>Edit Personal Details</Link>

            <Divider className='divider' />


            <div id='introduce'>
                {profile.bio ? <p>{profile.bio}</p> :  <p>Hi, I'm {profile.first_name+' '+profile.last_name}. {profile.education && 'I study at ' + profile.education +'.'}</p>}
            </div>
            
            <Link underline="none" to='/profile/edit'>Edit description</Link>
        </div>
            
        <div className='rightProfile'>
            {getisStudent() && 
            <>
                <div className='Tips'>Tips:</div>
                <div className='TipsContent'>
                    <p>Our programs give students a genuine career advantage - Twosum students are 71% more likely to be hired if they’ve completed that company’s virtual experience program.</p>
                    <p>So, what are you waiting for?</p>
                </div>
                <div  className='Button'>
                    <Button type='primary' onClick={() => navigate('/home-page')}>Find a project</Button>
                </div>
            </>
            } 
            {!getisStudent() && 
                <div className='TipsContent'>
                    <div  style={{fontWeight: "bold", marginBottom: "20px"}}>Hi {profile.first_name}, </div>
                    <p >Welcome to join our Twosum mentor team! Twosum is committed to providing an online learning platform for students.  If you have not launched a project, you can click the button below to get start!</p>
                    <div  className='Button'>
                        <Button type='primary' onClick={() => navigate('/profile/new-project')}>Publish a new project</Button>
                    </div>
                </div>
            } 
        </div>
        
    </div>
    <Divider className='divider' />
    {!getisStudent() && <div className="feedback">
        <>
        <div className="application-list">
            <div className="title">Project feedback</div>
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
    </div>}
    </>}
    </div>
    </>
  );
}

export default Profileindex;
