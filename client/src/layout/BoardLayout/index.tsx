import BoardHeader from './BoardHeader';
import { Outlet } from 'react-router-dom';

const BoardLayout = () => {
  return (
    <div className='flex flex-col h-full'>
      <BoardHeader />
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  );
};

export default BoardLayout;
