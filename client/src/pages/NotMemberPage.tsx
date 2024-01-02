import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotMemberPage = () => {
  return (
    <div className='bg-background w-screen h-screen flex justify-center items-center'>
      <div className='flex flex-col gap-y-2 items-center'>
        <p className='text-4xl text-foreground font-bold'>
          Unauthorization | You are not member of room
        </p>
        <Link to={'/explore'}>
          <Button variant={'link'}>Go to explore page</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotMemberPage;
