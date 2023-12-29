import React from 'react';
import img1 from '../photos/img1.png';
import img2 from '../photos/img2.png';
import img3 from '../photos/img3.png';
import img4 from '../photos/img4.png';
import dc from '../photos/dc.png';
// import { FiPlus } from "react-icons/fi";
// import { AiFillCompass } from "react-icons/ai";
import { CompassIcon, PlusIcon } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';
const groups = [img1, img2, img3, img4, img1];
const Groups = () => {
  return (
    <div className='hidden sm:flex bg-[#212226] w-[4rem] shrink-0 h-screen sticky top-0 pt-6'>
      {/* Groups */}
      <div className='flex flex-col items-center w-full space-y-4'>
        {/* Discord */}
        {/* <Link to="/"> */}
        <div
          data-tooltip-target='tooltip-right'
          data-tooltip-placement='right'
          className='bg-[#36393f] w-3/4 p-0 rounded-[1.3rem] hover:bg-[#5865f2] hover:rounded-2xl cursor-pointer'
        >
          <img src={dc} className='w-full rounded-full text-white ' />
        </div>
        {/* </Link> */}

        {/* Compass */}
        <div className='bg-[#36393f] w-3/4 p-2 rounded-[1.3rem] hover:rounded-2xl cursor-pointer'>
          <CompassIcon className='w-full h-auto rounded-full  text-emerald-700' />
        </div>
        {/* Groups */}
        <div className='space-y-4 p-0 w-3/4'>
          {groups.map(group => (
            <div className='w-full h-auto flex cursor-pointer' key={group}>
              <img src={group} className='object-cover rounded-full hover:rounded-2xl' />
            </div>
          ))}
        </div>

        {/* Plus */}
        <div className='bg-[#36393f] p-4 rounded-full hover:rounded-2xl w-3/4'>
          <PlusIcon className='w-full h-auto rounded-full text-emerald-700 cursor-pointer' />
        </div>
      </div>
    </div>
  );
};

export default Groups;
