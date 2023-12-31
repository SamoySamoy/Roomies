import { LogOut, XCircle } from 'lucide-react';
import React from 'react';
import img1 from '@/assets/avatar/ava1.jpg'

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-90'>
      <div className='w-11/12 md:w-1/2 lg:w-2/5 xl:w-1/3'>
        <div className='bg-green-500 h-10 rounded-t-md relative border border-green-500'>
          <button
            onClick={onClose}
            className='absolute top-1 right-3 rounded-full'
          >
            <XCircle size={30} className='bg-none duration-300 hover:scale-105'/> 
          </button>
        </div>
        <div className=' p-4 rounded-b-md border border-zinc-400'>
          <div className=' bg-zinc-800 rounded-md p-4'> 
            <div className='flex items-center pb-4'>
              <figcaption className='flex items-center space-x-4'>
                <img
                  src={img1}
                  alt=""
                  className="flex-none w-16 h-16 rounded-full object-cover border-2 border-zinc-400 duration-300 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className='text-lg font-semibold text-white'>
                  Name
                </div>
              </figcaption>
              <button className='text-white px-2 py-1 rounded-md text-sm ml-auto bg-green-500 duration-300 hover:scale-105'>
                Edit Avatar
              </button>
            </div>

            <div className='grid grid-cols-1 gap-4 mt-4'>
              <div className='flex items-center pb-8'>
                <div>
                  <p className='text-gray-400 font-semibold text-xs'>EMAIL</p>
                  <p className='text-white font-normal'>example@example.com</p>
                </div>
                <button className='text-white px-2 py-1 rounded-md text-sm ml-auto bg-green-500 duration-300 hover:scale-105'>Edit</button>
              </div>
              <div className='flex justify-center'>
                <button className='w-[50%] text-white py-2 rounded-md bg-green-500 duration-300 hover:scale-105'>
                  Change Password
                </button>
              </div>
              <div className='flex justify-center'>
                <button className='flex justify-center w-[50%] text-white py-2 rounded-md bg-red-500 duration-300 hover:scale-105'>
                  Logout
                  <LogOut className='pl-2'/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
