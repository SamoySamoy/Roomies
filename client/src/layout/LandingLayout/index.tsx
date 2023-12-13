import LandingHeader from './LandingHeader';
import { Outlet } from 'react-router-dom';

const LandingLayout = () => {
  return (
    <div className='flex h-full flex-col'>
      <LandingHeader />
      <div className='flex flex-1'>
        <Outlet />
      </div>
    </div>
  );
};

export default LandingLayout;
