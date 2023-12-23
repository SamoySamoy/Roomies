import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import ActionTooltip from '@/components/ActionToolTip';
import { Link } from 'react-router-dom';

const LandingHeader = () => {
  return (
    <div className='flex h-16 w-full items-center justify-between border-b border-solid border-gray-400/20 bg-background px-2 py-1 dark:border-gray-400/50'>
      <div className='text-4xl font-bold text-foreground'>
        <Link to={'/'}>
          <p className='text-green-400 pl-10'>ROOMIES</p>
        </Link>
      </div>
      <nav className='flex gap-4 font-bold'>
        <Link
          to={'/'}
          className='px-2 transition duration-300 ease-in-out transform hover:scale-110 hover:underline'
        >
          Home
        </Link>
        <Link
          to={'/explore'}
          className='px-2 transition duration-300 ease-in-out transform hover:scale-110 hover:underline'
        >
          Explore
        </Link>
        <Link
          to={'/rooms/my-rooms'}
          className='px-2 transition duration-300 ease-in-out transform hover:scale-110 hover:underline'
        >
          Room
        </Link>
      </nav>
      <div className='flex gap-4 pr-10'>
        <div className='flex gap-4'>
          <ActionTooltip label='Login to connect with your friends'>
            <Link to={'/login'}>
              <Button variant='outline' className='font-bold'>
                Sign In
              </Button>
            </Link>
          </ActionTooltip>
          <ActionTooltip label='Create a new account and discover more'>
            <Link to={'/register'}>
              <Button className='bg-green-400'>
                <span className='font-bold text-background'>Get start</span>
              </Button>
            </Link>
          </ActionTooltip>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default LandingHeader;
