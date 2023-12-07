import LandingHeader from './LandingHeader';
import { Outlet } from 'react-router-dom';

const LandingLayout = () => {
  return (
    <div className='flex flex-col h-full'>
      <LandingHeader />
      <div className='flex-1 flex'>
        <Outlet />
      </div>
    </div>
  );
};

export default LandingLayout;
