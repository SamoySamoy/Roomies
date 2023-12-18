import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import ActionTooltip from '@/components/ActionToolTip';
import { Link } from 'react-router-dom';

const LandingHeader = () => {
  return (
    <div className='flex h-16 w-full items-center justify-between border-b border-solid border-gray-400/20 bg-background px-2 py-1 dark:border-gray-400/50'>
      <div className='text-4xl font-bold text-foreground'>
        <Link to={'/'}>
          <p className='text-green-400'>ROOMIES</p>
        </Link>
      </div>
      <nav className='flex gap-4 font-bold'>
        <Link to={'/'} className="px-2">Home</Link>
        <Link to={'/explore'} className="px-2">Explore</Link>
        <Link to={'/rooms/12345'} className="px-2">Room</Link>
      </nav>
      <div className='flex gap-4'>
        <div className='flex gap-4'>
          <ActionTooltip label='Login to connect with your friends'>
            <Link to={'/auth/login'}>
              <Button variant='outline' className='font-bold'>
                Sign In
              </Button>
            </Link>
          </ActionTooltip>
          <ActionTooltip label='Create a new account and discover more'>
            <Link to={'/auth/register'}>
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
