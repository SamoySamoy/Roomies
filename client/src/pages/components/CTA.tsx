import { Button } from '@/components/ui/button';
import { HeartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <div className='w-full py-24 md:max-w-[1480px] m-auto flex flex-col items-center justify-center gap-4 max-w-[600px] px-4 md:px-0'>
      <h1 className='py-2  text-3xl font-semibold'>
        Let's join <span className='text-emerald-400'>Roomies</span> with us
      </h1>
      <Link to={'/auth/register'}>
        <Button className='bg-emerald-400 transition duration-300 ease-in-out transform hover:scale-110 hover:text-accent-foreground dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8]'>
          <div className='flex flex-row items-center justify-center gap-2'>
            <span className='font-bold text-background'>Join now</span>
            <HeartIcon className='text-red-400' />
          </div>
        </Button>
      </Link>
    </div>
  );
};

export default CTA;
