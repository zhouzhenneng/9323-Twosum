import React from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom';
import './LadingPage.css'
import bg from "../img/landing-page.jpg"
import logo from "../img/logo.png"
import Amazon from "../img/amazon.svg"
import Github from "../img/github-fill.svg"
import Ali from "../img/alibaba.svg"
import Jd from "../img/jd.svg"
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';


export default function LandingPage() {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/", {replace: true, });
  };
  return (
    <main className="home-container">
      <div className="home-bg-container">
        <img alt="home-bg" className="home-bg" src={bg} />
          <div className="home-logo" onClick={goHome}>
            <img className="logo" alt="logo" src={logo}/>
          </div>
          <div className="log-reg">
            <div className="register">
              <Link to='/register' className="link">Sign up</Link>
            </div>
            <div className="login">
              <Link to='/login' className="link login-link">login</Link>
            </div>
          </div>
        <div className="slogan">
          <span>Showcase your skills.</span>
          <span>Get real industry projects experience.</span>
        </div>
        <div className="start-button">
          <Button variant="contained" size="large" className="get-start" href="./login">Start Now</Button>
        </div>
      </div>

      <div className="icon-bar">
        <img src={Amazon} className="amazon" alt="icon"/>
        <img src={Ali} className="icon ali"  alt="icon"/>
        <img src={Jd} className="icon jd"  alt="icon"/>
        <img src={Github} className="icon github"  alt="icon"/>
      </div>

      <div className="description">
        <div className="title">
          Learn directly from top companies
        </div>
        <div className="text">
          The goal of Twosum is to create an online platform that enables students to build connections with mentors from industries and get real hands-on experience by working on the mentor-leading projects.
          In only 20-36 hours, learn the relevant tools necessary to complete a typical work day at that company.
          Our virtual work experience programs are 100% free, open-access, and self-paced.
        </div>
        <Button variant="contained" color="success" className="find-button" href="./login" endIcon={<SendIcon />}>
          Find a program
        </Button>
      </div>
      <footer>
        <div className="footer-container">
          <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 border-top">
            <div className="col mb-3">
              <div className="footer-logo" onClick={goHome}>
                <img className="logo" alt="logo" src={logo}/>
              </div>
            </div>

            <div className="col mb-3">

            </div>

            <div className="col mb-3">
              <h5>Section</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Company</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">About</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Press</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Careers</a></li>
              </ul>
            </div>

            <div className="col mb-3">
              <h5>Section</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Support</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Contact</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">FAQs</a></li>
              </ul>
            </div>

            <div className="col mb-3">
              <h5>Section</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">For students</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">All programs</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Tech programs</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Consulting programs</a></li>
              </ul>
            </div>
          </footer>
        </div>
      </footer>
    </main>
  )
}
