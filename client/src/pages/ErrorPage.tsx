import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className='bg-background w-screen h-screen flex justify-center items-center'>
      <div className='flex flex-col gap-y-2 items-center'>
        <p className='text-4xl text-foreground font-bold'>Error | Please try again</p>
        <Link to={'/'}>
          <Button variant={'link'}>Go to landing page</Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
