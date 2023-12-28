import { Outlet } from 'react-router-dom';
import ExploreSidebar from '@/components/Sidebar/ExploreSidebar';

const ExploreLayout = () => {
  return (
    <div className='h-full'>
      <div className='fixed inset-y-0 z-30 hidden h-full w-[72px] flex-col md:flex'>
        <ExploreSidebar />
      </div>
      <main className='h-full md:pl-[72px]'>
        <Outlet />
      </main>
    </div>
  );
};

export default ExploreLayout;
