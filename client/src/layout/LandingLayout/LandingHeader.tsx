import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import ActionTooltip from '@/components/ActionToolTip';
import { Link } from 'react-router-dom';

const LandingHeader = () => {
  return (
    <div className='h-16 w-full px-2 py-1 bg-background flex justify-between items-center border-b border-solid border-gray-400/20 dark:border-gray-400/50'>
      <div className='font-bold text-4xl text-foreground'>
        <Link to={'/'}>
          <p className='text-primary'>ROOMIES</p>
        </Link>
      </div>
      <div className='flex gap-4'>
        <div className='flex gap-4'>
          <ActionTooltip label='Login to connect with your friends'>
            <Button variant='outline' className='font-bold'>
              Sign In
            </Button>
          </ActionTooltip>
          <ActionTooltip label='Create a new account and discover more'>
            <Button>
              <span className='text-background font-bold'>Get start</span>
            </Button>
          </ActionTooltip>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default LandingHeader;
