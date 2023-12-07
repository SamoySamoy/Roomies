import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import ActionTooltip from '@/components/ActionToolTip';
import { Link } from 'react-router-dom';

const BoardHeader = () => {
  return (
    <div className='h-16 w-full px-2 py-1 bg-background flex justify-between items-center border-b border-solid border-gray-400/20 dark:border-gray-400/50'>
      <div className='font-bold text-4xl text-foreground flex gap-6 items-center'>
        <Link to={'/'}>
          <p className='text-primary'>ROOMIES</p>
        </Link>
        <Link to={'/board/explore'}>
          <Button variant={'link'}>Explore</Button>
        </Link>
        <Link to={'/board/rooms'}>
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
              <span className='text-white font-bold'>Sign Up</span>
            </Button>
          </ActionTooltip>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default BoardHeader;
