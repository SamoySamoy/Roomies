import heroImg from '@/assets/heroImg.png';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MainContent = () => {
  return (
    <div className='w-full'>
      <div className='md:max-w-[1480px] m-auto grid md:grid-cols-2 max-w-[600px]  px-4 md:px-0'>
        <div className='flex flex-col justify-start gap-4 pl-10 pr-10'>
          <p className='py-2 text-2xl text-green-400 font-medium'>
            Let's start your story{' '}
            <span className='inline-block text-3xl transform rotate-12'>🚀</span>
          </p>
          <h3 className='md:leading-[72px] py-2 md:text-5xl text-5xl font-semibold'>
            Connect with <span className='text-green-400'>Friends</span> around{' '}
            <span className='text-green-400'>the world</span>
          </h3>
          <p className='py-2 text-lg text-gray-600'>Anywhere and Anytime</p>
          <div className=''>
            <Link to={'/auth/register'}>
              <Button className='bg-green-400 transition duration-300 ease-in-out transform hover:scale-110 hover:text-accent-foreground dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8]'>
                <span className='font-bold text-background '>Start now</span>
              </Button>
            </Link>
          </div>
        </div>
        <img
          src={heroImg}
          className='order-first transform translate-y-4 hover:translate-y-0 transition-transform duration-300'
        />
      </div>
    </div>
  );
};

export default MainContent;
