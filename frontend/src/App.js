import './App.css';
import LandingPage from './Component/LandingPage';
import {BrowserRouter, Routes, Route, useLocation,} from 'react-router-dom';
import LoginPage from './Component/LoginPage';
import RegisterPage from './Component/RegisterPage';
import HomePage from './Component/HomePage';
import TwoSumFooter from './layout/footer';
import TwoSumHeader from './layout/header'
import {useMemo,useState,useEffect} from 'react';
import Profileindex from './Component/Profile/components/index.js'
import EditProfile from './Component/Profile/editProfile';
import NotFound from './Component/notFoundPage'
import Aside from './layout/aside'
import ChatPage from './Component/Profile/components/ChatPage';
import NewProjectForm from './Component/Profile/components/NewProjectForm';
import ProjectPage from './Component/Profile/components/ProjectPage';
import ProjectDetailPage from "./Component/ProjectDetailPage";
import EditPorject from "./Component/Profile/components/editProject";
import MyTasks from './Component/mentor/mytask';
import MessageSection from './Component/Profile/components/MessageSection';
import HelpPage from './Component/helpPage';

function App() {
  const [mainClassName,setmainClassName] = useState('main-body')
  const chatUrl = /\/profile\/chat\/[0-9]+/
  const FullPagePath = ['/', '/home'];
  const ProfilePagePath = ['/profile/index', '/profile/chat','/profile/projects','/profile/tasks','/profile/help']
  const location = useLocation();
  const bodyStyle = useMemo(() => (
    location.pathname === "/"
    ? {
        padding: 0,
        margin: 0,
      }:{}
  ), [location])



  useEffect(()=>{
    const fetchApplication = async()=>{
      location.pathname === "/"||location.pathname.indexOf('project-detail')>0 ? setmainClassName('home-container') : setmainClassName('main-body')

    }
    fetchApplication()
  },[])

  return (
    <>
      {(ProfilePagePath.includes(location.pathname)) &&<Aside/>}
      <div className='MainSections'>
        {!FullPagePath.includes(location.pathname) &&  <TwoSumHeader/>}
        <main className='main-body' style={bodyStyle}>
          <Routes>
            <Route path='/' element={<LandingPage/>} />
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/register' element={<RegisterPage/>}/>
            <Route path='/home-page' element={<HomePage/>}/>
            <Route path='/profile'>
              <Route path='index' element={<Profileindex/>}/>
              <Route path='edit' element={<EditProfile/>}/>
              <Route path='new-project' element={<NewProjectForm/>} />
              <Route path='edit-project/:project_id' element={<EditPorject/>} />
              <Route path='projects' element={<ProjectPage/>} />
              <Route path='tasks' element={<MyTasks/>} />
              <Route path='chat' element={<ChatPage/>} />
              <Route path='help' element={<HelpPage/>} />
            </Route>
            <Route path='/project-detail/:project_id' element={<ProjectDetailPage/>}/>
            <Route
              path="*"
              element={
                <NotFound />
              }
            />
          </Routes>
            </main>
        
      </div>
      {!FullPagePath.includes(location.pathname) &&  <TwoSumFooter/>}
    </>
  );
}

export default App;
