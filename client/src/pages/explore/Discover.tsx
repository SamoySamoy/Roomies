import {
  CompassIcon,
  Gamepad2Icon,
  MusicIcon,
  GraduationCapIcon,
  AtomIcon,
  Tv2Icon,
  Mic,
  Headphones,
  Settings,
} from 'lucide-react';
import Topic from './Topic';
import lmfao from '../photos/lmfao.jpg';

const topics = [
  { title: 'Home', icon: <CompassIcon /> },
  { title: 'Gaming', icon: <Gamepad2Icon /> },
  { title: 'Music', icon: <MusicIcon /> },
  { title: 'Education', icon: <GraduationCapIcon /> },
  { title: 'Science & tech', icon: <AtomIcon /> },
  { title: 'Entertainment', icon: <Tv2Icon /> },
];

const Discover = () => {
  return (
    <div className='hidden xl:flex flex-col justify-between bg-[#303136] w-[15rem] shrink-0  h-screen sticky top-0'>
      <div className='p-4'>
        {/* Title */}
        <p className='text-white font-bold text-[24px]'>Discover</p>
        {/* Topics */}
        <div className='mt-4 space-y-4'>
          {topics.map(topic => (
            <Topic title={topic.title} icon={topic.icon} />
          ))}
        </div>
      </div>

      {/* Profile Settings */}
      <div className='bg-[#292b2f] h-[5rem] flex text-white items-center px-2 justify-between'>
        <div className='flex items-center '>
          <img src={lmfao} alt='' className='w-12 h-12 rounded-full' />
          <div className=' pl-1 text-[16px]'>
            <p>username</p>
            <p className='text-[12px] text-gray-400'>#12345</p>
          </div>
        </div>

        <div className='flex space-x-2'>
          <Mic size={20} className='cursor-pointer' />
          <Headphones size={20} className='cursor-pointer' />
          <Settings size={20} className='cursor-pointer' />
        </div>
      </div>
    </div>
  );
};

export default Discover;
