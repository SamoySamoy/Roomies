import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Instagram, Twitch, Github } from 'lucide-react';

const Footer = () => {
  return (
    <div className='w-full py-20 px-20'>
      <div className='md:max-w-[1480px] m-auto grid md:grid-cols-5 max-[780px]:grid-cols-2 gap-8 max-w-[600px] py-10 md:px-0 border-y-2 border-zinc-800'>
        <div className='col-span-2'>
          <div className='text-4xl font-bold text-foreground'>
            <Link to={'/'}>
              <p className='text-emerald-500'>ROOMIES</p>
            </Link>
          </div>
          <h3 className='text-2xl font-bold mt-10'>Contact Us</h3>
          <h3 className='py-1'>Call : +123 400 123</h3>
          <h3 className='py-1'>Email: example@mail.com</h3>
          <div className='flex gap-4 py-4'>
            <div className='p-4 bg-emerald-500 rounded-xl'>
              <Facebook className='w-6 h-6 text-white stroke-white' />
            </div>
            <div className='p-4 bg-emerald-500 rounded-xl'>
              <Linkedin className='w-6 h-6 text-white stroke-white' />
            </div>
            <div className='p-4 bg-emerald-500 rounded-xl'>
              <Instagram className='w-6 h-6 text-white stroke-white' />
            </div>
            <div className='p-4 bg-emerald-500 rounded-xl'>
              <Twitch className='w-6 h-6 text-white stroke-white' />
            </div>
            <div className='p-4 bg-emerald-500 rounded-xl'>
              <Github className='w-6 h-6 text-white stroke-white' />
            </div>
          </div>
        </div>
        <div>
          <h3 className='text-2xl font-bold'>Explore</h3>
          <ul className='py-6'>
            <li className='py-2'>Home</li>
            <li className='py-2'>About</li>
            <li className='py-2'>Blog</li>
            <li className='py-2'>Status</li>
            <li className='py-2'>Contact</li>
          </ul>
        </div>
        <div>
          <h3 className='text-2xl font-bold'>Resources</h3>
          <ul className='py-6'>
            <li className='py-2'>Support</li>
            <li className='py-2'>Safety</li>
            <li className='py-2'>Feedback</li>
            <li className='py-2'>Community</li>
            <li className='py-2'>Developers</li>
          </ul>
        </div>
        <div>
          <h3 className='text-2xl font-bold'>Policies</h3>
          <ul className='py-6'>
            <li className='py-2'>Terms</li>
            <li className='py-2'>Privacy</li>
            <li className='py-2'>Cookies Settings</li>
            <li className='py-2'>Guidelines</li>
            <li className='py-2'>Licenses</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
