import { Button } from '@/components/ui/button';
import ActionTooltip from '@/components/ActionToolTip';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const LandingHeader = () => {
  const isLogin = Boolean(useAuth().auth.accessToken);

  return (
    <div className='flex w-full items-center justify-between px-10 py-5
    border-b border-slate-400/30 bg-black shadow-[0_0_2rem_-0.5rem_#fff8]'>
      <div className='text-3xl font-bold text-foreground'>
        <Link to={'/'}>
          <p className='text-emerald-500 pl-10'>ROOMIES</p>
        </Link>
      </div>
      <div className='flex items-center gap-4 pr-10'>
        {/* <ActionTooltip label='Homepage'>
          <Link
            to={'/'}
            className='transition duration-300 ease-in-out transform hover:scale-110 hover:underline rounded-full'
          >
            <Button
              className='text-white border-zinc-600 bg-zinc-900 border rounded-full font-bold shadow-[0_0_2rem_-0.5rem_#fff7] 
              hover:text-emerald-500 hover:border-emerald-500 hover:bg-zinc-900 w-24'
            >
              Home
            </Button>
          </Link>
        </ActionTooltip> */}
        <ActionTooltip label='Explore a variety of communities '>
          <Link
            to={'/explore'}
            className='transition duration-300 ease-in-out transform hover:scale-110 rounded-full'
          >
            <Button
              className='text-white border-zinc-600 bg-zinc-900 border rounded-full font-bold shadow-[0_0_2rem_-0.5rem_#fff7] 
              hover:text-emerald-500 hover:border-emerald-500 hover:bg-zinc-900 w-24'
            >
              Explore
            </Button>
          </Link>
        </ActionTooltip>
        <ActionTooltip label='Room'>
          <Link
            to={'/my-rooms'}
            className='transition duration-300 ease-in-out transform hover:scale-110 rounded-full'
          >
            <Button
              className='text-white border-zinc-600 bg-zinc-900 border rounded-full font-bold shadow-[0_0_2rem_-0.5rem_#fff7] 
              hover:text-emerald-500 hover:border-emerald-500 hover:bg-zinc-900 w-24'
            >
              Room
            </Button>
          </Link>
        </ActionTooltip>
        {!isLogin && (
          <>
            <div className='h-8 border-l border-gray-400/30'></div>
            <ActionTooltip label='Login to connect with your friends'>
              <Link
                to={'/login'}
                className='transition duration-300 ease-in-out transform hover:scale-110 rounded-full'
              >
                <Button
                  className='text-white border-zinc-600 bg-zinc-900 border rounded-full font-bold shadow-[0_0_2rem_-0.5rem_#fff7] 
                  hover:text-emerald-500 hover:border-emerald-500 hover:bg-zinc-900 w-24'
                >
                  Sign In
                </Button>
              </Link>
            </ActionTooltip>
            <ActionTooltip label='Create a new account and discover more'>
              <Link
                to={'/register'}
                className='transition duration-300 ease-in-out transform hover:scale-110 rounded-full hover:shadow-[0_0_2rem_-0.5rem_#fff]'
              >
                <Button className='bg-emerald-500 rounded-full w-24 hover:bg-white'>
                  <span className='text-black font-bold'>Get started</span>
                </Button>
              </Link>
            </ActionTooltip>
          </>
        )}
      </div>
    </div>
  );
};

export default LandingHeader;
