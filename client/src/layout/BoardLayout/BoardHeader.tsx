import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import ActionTooltip from '@/components/ActionToolTip';
import { Link } from 'react-router-dom';

const BoardHeader = () => {
  return (
    <div className='flex h-16 w-full items-center justify-between border-b border-solid border-gray-400/20 bg-background px-2 py-1 dark:border-gray-400/50'>
      <div className='flex items-center gap-6 text-4xl font-bold text-foreground'>
        <Link to={'/'}>
          <p className='text-primary'>ROOMIES</p>
        </Link>
        <Link to={'/explore'}>
          <Button variant={'link'}>Explore</Button>
        </Link>
        <Link to={'/rooms/12345'}>
          <Button variant={'link'}>Rooms</Button>
        </Link>
      </div>

      <div className='flex gap-4'>
        <div className='flex gap-4'>
          <ActionTooltip label='Login to connect with your friends'>
            <Button variant='outline' className='font-bold'>
              Login
            </Button>
          </ActionTooltip>
          <ActionTooltip label='Create a new account and discover more'>
            <Button>
              <span className='font-bold text-white'>Sign Up</span>
            </Button>
          </ActionTooltip>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default BoardHeader;