import React from 'react'
import { Link } from 'react-router-dom';
// import { logo } from '../assets'
import {FaFacebookF,FaDribbble,FaLinkedinIn,FaInstagram,FaBehance} from 'react-icons/fa'

const Footer = () => {
  return (
    <div className='w-full py-24'>
        <div className='md:max-w-[1480px] m-auto grid md:grid-cols-5 max-[780px]:grid-cols-2  gap-8 max-w-[600px]  px-4 md:px-0'>
            <div className='col-span-2'>
                {/* <img src={logo} className="h-[25px]" /> */}
                <div className='text-4xl font-bold text-foreground'>
                    <Link to={'/'}>
                        <p className='text-green-400'>ROOMIES</p>
                    </Link>
                </div>
                <h3 className='text-2xl font-bold mt-10'>Contact Us</h3>
                <h3 className='py-2'>Call : +123 400 123</h3>
                <h3 className='py-2'>Praesent nulla massa, hendrerit <br></br> vestibulum gravida in, feugiat auctor felis.</h3>
                <h3 className='py-2'>Email: example@mail.com</h3>
                <div className='flex gap-4 py-4'>
                        <div className='p-4 bg-green-400 rounded-xl'><FaFacebookF size={25} style={{color:'#fff'}} /></div>
                        <div className='p-4 bg-green-400 rounded-xl'><FaDribbble size={25} style={{color:'#fff'}} /></div>
                        <div className='p-4 bg-green-400 rounded-xl'><FaLinkedinIn size={25} style={{color:'#fff'}} /></div>
                        <div className='p-4 bg-green-400 rounded-xl'><FaInstagram size={25} style={{color:'#fff'}} /></div>
                        <div className='p-4 bg-green-400 rounded-xl'><FaBehance size={25} style={{color:'#fff'}} /></div>
                </div>
            </div>
            <div>
                <h3 className='text-2xl font-bold'>Explore</h3>
                <ul className='py-6'>
                    <li className='py-2'>Home</li>
                    <li className='py-2'>About</li>
                    <li className='py-2'>Course</li>
                    <li className='py-2'>Blog</li>
                    <li className='py-2'>Contact</li>
                </ul>
            </div>
            <div>
                <h3 className='text-2xl font-bold'>Category</h3>
                <ul className='py-6'>
                    <li className='py-2'>Design</li>
                    <li className='py-2'>Development</li>
                    <li className='py-2'>Marketing</li>
                    <li className='py-2'>Business</li>
                    <li className='py-2'>Lifestyle</li>
                    <li className='py-2'>Photography</li>
                    <li className='py-2'>Music</li>
                </ul>
            </div>
            <div className='max-[780px]:col-span-2'>
                <h3 className='text-2xl font-bold'>Subscribe</h3>
                <h3 className='py-2'>Praesent nulla massa, hendrerit <br></br> vestibulum gravida in, feugiat auctor felis.</h3>
                <form className='py-4'>
                    <input 
                        className='p-4 w-full rounded text-black' 
                        placeholder='Email here' 
                    />
                    <button className='max-[780px]:w-full my-4 px-5 py-3 rounded-md bg-green-400 text-white font-medium'>Subscribe Now</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Footer