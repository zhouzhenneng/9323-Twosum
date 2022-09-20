
import {Routes, Route, useLocation,} from 'react-router-dom';
import Profileindex from './components/index'
 
function UserProfile() {
  const FullPagePath = ['/', '/home'];
  const location = useLocation();
  return (
    <>
    12321
      <div className='profile-body'>
        12321312
          <Route path='/profile/index' element={<Profileindex/>} />
      </div>
    </>
  );
}

export default UserProfile;
