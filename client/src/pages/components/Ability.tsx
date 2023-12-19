import React from 'react'
import achievementImage from '@/assets/achievement.png';
import {SlGraduation} from 'react-icons/sl'
import {FiVideo} from 'react-icons/fi'
import {SlPeople} from 'react-icons/sl'

const Achievement = () => {
  return (
    <div className='w-full py-24'>
        <div className='md:max-w-[1480px] m-auto grid md:grid-cols-2 max-w-[600px]  px-4 md:px-0'>
            <div className='flex flex-col justify-center '>
                <h1 className='md:leading-[72px] text-3xl font-bold'>Tạo ra một <span className='text-green-400'>Không gian riêng</span></h1>
                <p className='text-lg text-gray-600'>Roomies cung cấp đa dạng kênh trò chuyện</p>
                <div className='grid grid-cols-2 py-8'>
                    <div className='py-6 flex'>
                        <div className='p-4 bg-[#E9F8F3] rounded-xl'>
                            <SlGraduation 
                                size={30}
                                style={{color:'#1A906B'}}
                            />
                        </div>
                        <div className='px-3'>
                            <h1 className='text-2xl font-semibold'>Chat</h1>
                            <p className='text-[#6D737A]'>Trò chuyện tự do</p>
                        </div>
                    </div>
                    <div className='py-6 flex'>
                        <div className='p-4 bg-[#FFFAF5] rounded-xl'>
                            <FiVideo 
                                size={30}
                                style={{color:'#FFC27A'}}
                            />
                        </div>
                        <div className='px-3'>
                            <h1 className='text-2xl font-semibold'>Video</h1>
                            <p className='text-[#6D737A]'>Gặp gỡ bạn bè</p>
                        </div>
                    </div>
                    <div className='py-6 flex'>
                        <div className='p-4 bg-[#FFEEF0] rounded-xl'>
                            <SlGraduation 
                                size={30}
                                style={{color:'#ED4459'}}
                            />
                        </div>
                        <div className='px-3'>
                            <h1 className='text-2xl font-semibold'>Voice</h1>
                            <p className='text-[#6D737A]'>Thoải mái trao đổi</p>
                        </div>
                    </div>
                    <div className='py-6 flex'>
                        <div className='p-4 bg-[#F0F7FF] rounded-xl'>
                            <SlPeople 
                                size={30}
                                style={{color:'#0075FD'}}
                            />
                        </div>
                        <div className='px-3'>
                            <h1 className='text-2xl font-semibold'>Private Chat</h1>
                            <p className='text-[#6D737A]'>Cuộc trò chuyện bí mật</p>
                        </div>
                    </div>
                </div>
           </div>             
             <img  src={achievementImage} className="m-auto md:order-last  order-first transform translate-y-4 hover:translate-y-0 transition-transform duration-300" />
        </div>   
    </div>
  )
}

export default Achievement