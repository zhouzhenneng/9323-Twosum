import * as React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import './css/footer.css'
export default function TwoSumFooter() {
    return (
      <footer className='footer'>
        <div className='footernavi'>
          
        <div className='footerlogo'>
              
              <img src={require('../img/logo.png')} alt="TwoSumLogo" ></img>
            </div>
          <p>Press</p>
          <p>Contact</p>
          <p>Privacy</p>
          <p>Policy</p>
          <p>Cookies</p>
          <p>Terms of Use</p>
          <p>FAQ</p>
          <p>Virtual Experience</p>
          <p>Security Sitemap</p>

        </div>

        <div className='contactway'>
        <InstagramIcon fontSize='large'/>
        <TwitterIcon fontSize='large'/>
        <FacebookIcon fontSize='large'/>

        </div>
      </footer>
    );
  }