import { Button } from '@/components/ui/button';
import ActionTooltip from '@/components/ActionToolTip';
import { Link } from 'react-router-dom';

const LandingHeader = () => {
  return (
    <div className='flex w-full items-center justify-between border-b border-solid border-slate-400/30 bg-background px-10 py-5 shadow-[0_0_2rem_-0.5rem_#fff8] bg-black'>
      <div className='text-3xl font-bold text-foreground'>
        <Link to={'/'}>
          <p className='text-emerald-500 pl-10'>ROOMIES</p>
        </Link>
      </div>
      <div className='flex items-center gap-4 pr-10'>
        <ActionTooltip label='Homepage'>
          <Link
            to={'/'}
            className='transition duration-300 ease-in-out transform hover:scale-110 hover:underline rounded-full'
          >
            <Button
              variant='outline'
              className='text-white border border-zinc-600 shadow-[0_0_2rem_-0.5rem_#fff7] font-bold rounded-full hover:border-emerald-500 hover:text-emerald-500 bg-zinc-900 hover:bg-zinc-900 w-24'
            >
              Home
            </Button>
          </Link>
        </ActionTooltip>

        <ActionTooltip label='Explore a variety of communities '>
          <Link
            to={'/explore'}
            className='transition duration-300 ease-in-out transform hover:scale-110 hover:underline rounded-full'
          >
            <Button
              variant='outline'
              className='text-white border border-zinc-600 shadow-[0_0_2rem_-0.5rem_#fff7] font-bold rounded-full hover:border-emerald-500 hover:text-emerald-500 bg-zinc-900 hover:bg-zinc-900 w-24'
            >
              Explore
            </Button>
          </Link>
        </ActionTooltip>

        <ActionTooltip label='Room'>
          <Link
            to={'/my-rooms'}
            className='transition duration-300 ease-in-out transform hover:scale-110 hover:underline rounded-full'
          >
            <Button
              variant='outline'
              className='text-white border border-zinc-600 shadow-[0_0_2rem_-0.5rem_#fff7] font-bold rounded-full hover:border-emerald-500 hover:text-emerald-500 bg-zinc-900 hover:bg-zinc-900 w-24'
            >
              Room
            </Button>
          </Link>
        </ActionTooltip>

        <div className='h-8 border-l border-gray-400/30'></div>

        <ActionTooltip label='Login to connect with your friends'>
          <Link
            to={'/login'}
            className='transition duration-300 ease-in-out transform hover:scale-110 hover:underline rounded-full'
          >
            <Button
              variant='outline'
              className='text-white border border-zinc-600 shadow-[0_0_2rem_-0.5rem_#fff7] font-bold rounded-full hover:border-emerald-500 hover:text-emerald-500 bg-zinc-900 hover:bg-zinc-900 w-24'
            >
              Sign In
            </Button>
          </Link>
        </ActionTooltip>

        <ActionTooltip label='Create a new account and discover more'>
          <Link
            to={'/register'}
            className='rounded-full transition duration-300 ease-in-out transform hover:scale-110 hover:underline dark:hover:shadow-[0_0_2rem_-0.5rem_#fff]'
          >
            <Button className='bg-emerald-500 rounded-full w-24'>
              <span className='text-black font-bold text-background '>Get started</span>
            </Button>
          </Link>
        </ActionTooltip>
      </div>
    </div>
  );
};

export default LandingHeader;
