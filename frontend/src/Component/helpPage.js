import { Collapse } from 'antd';
import React from 'react';
import "./helpPage.css"


const { Panel } = Collapse;

const HelpPage = () => (
    <div className='container'>
        <div className="top-container">Frequently Asked Questions</div>
        <Collapse style={{width: "70%", overflow:"scroll", height: "75vh"}} ghost bordered={false} defaultActiveKey={['1']}>
            <Panel style={{fontSize: "15px", fontWeight: "bold"}} header="What is Twosum?" key="1">
                <p style={{fontSize: "15px", fontWeight: "normal", paddingLeft: 24,}}>
                Twosum is an open access platform designed to unlock exciting careers for students by connecting them with our company-endorsed Virtual Work Experience Programs.
                </p>
            </Panel>
            <Panel style={{fontSize: "15px", fontWeight: "bold"}} header="What are Virtual Work Experience Programs? " key="2">
                <p style={{fontSize: "15px", fontWeight: "normal", paddingLeft: 24,}}>
                Virtual Work Experience Programs are online programs built and endorsed by leading companies. They contain a series of resources and tasks designed to simulate the real-world experience of starting a career.
                </p>
            </Panel>
            <Panel style={{fontSize: "15px", fontWeight: "bold"}} header="Great, but why would I want to do a Virtual Work Experience Program?" key="3">
                <p style={{fontSize: "15px", fontWeight: "normal", paddingLeft: 24,}}>
                In a nutshell Virtual Work Experience Programs on Twosum are designed first and foremost to help students.  By completing a Twosum Virtual Internship you will:
                </p>
                <p style={{fontSize: "15px", fontWeight: "normal", paddingLeft: 35,}}>
                Better understand the diverse and exciting career pathways available to you;
                </p>
                <p style={{fontSize: "15px", fontWeight: "normal", paddingLeft: 35,}}>
                Build the skills and confidence that will set you up for success as you move from the world of study to the world of work
                </p>
            </Panel>
            <Panel style={{fontSize: "15px", fontWeight: "bold"}} header="Okay sounds good, but what is the difference between a physical internship and a Virtual Work Experience Program?" key="4">
                <p style={{fontSize: "15px", fontWeight: "normal", paddingLeft: 24,}}>
                Think of it like a risk-free opportunity to try out a career in a leading firm, the main differences are:
                </p>
                <p style={{fontSize: "15px", fontWeight: "normal", paddingLeft: 35,}}>
                The best part is, Virtual Internships are truly digital, you can complete them in your own time, from anywhere in the world.
                </p>
                <p style={{fontSize: "15px", fontWeight: "normal", paddingLeft: 35,}}>
                You can’t make any mistakes in a Virtual Internship (no pressure!)
                </p>
            </Panel>
            <Panel style={{fontSize: "15px", fontWeight: "bold"}} header="How do I sign up?" key="5">
                <p style={{fontSize: "15px", fontWeight: "normal", paddingLeft: 24,}}>
                It’s really easy! Just click register to create and Twosum account, we will ask you to provide some information to find out more about you (so that we can recommend some of the best Virtual Internships for you) and then you’re free to browse the Virtual Internships on our platform.
                </p>
            </Panel>
            <Panel style={{fontSize: "15px", fontWeight: "bold"}} header="Do I need to pay to join Twosum?" key="6">
                <p style={{fontSize: "15px", fontWeight: "normal", paddingLeft: 24,}}>
                <span style={{fontWeight: "bold"}}>No you do not need to pay.</span> Virtual Internships are - and will always remain - <span style={{fontWeight: "bold"}}>completely free</span>. You can also attempt any of our Virtual Internships with no prior work experience – try them out and don’t forget to let us know what you think!
                </p>
            </Panel>
            <Panel style={{fontSize: "15px", fontWeight: "bold"}} header="Can International Students do Virtual Work Experience Programs?" key="7">
                <p style={{fontSize: "15px", fontWeight: "normal", paddingLeft: 24}}>
                Yes! Virtual Work Experience Programs are open access for everyone, even international students. You can do them regardless of your visa or work status,
                </p>
            </Panel>
        </Collapse>
    </div>
  
);

export default HelpPage;