import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Typed from 'react-typed';

const MainContent = () => {

    return (
        <div className='max-w-[800px] w-full mx-auto text-center flex flex-col justify-center py-10'>
            <h1 className='text-green-400 md:text-7xl sm:text-6xl text-4xl font-bold md:py-6'>
                Welcome to Roomies
            </h1>

            <div className='flex flex-col items-center'>
                <p className='md:text-5xl sm:text-4xl text-xl py-4'>
                Connect with your Friends
                </p>
                <div className='border-2 rounded-full border-gray-500 hover:border-green-400 bg-zinc-900 hover:bg-zinc-900 px-4 py-2 shadow-[0_0_2rem_-0.5rem_#fff8]'>
                <Typed
                    className='md:text-5xl sm:text-4xl text-xl md:pl-4 pl-2'
                    strings={['Gaming', 'Coding', 'Chit-chat']}
                    typeSpeed={100}
                    backSpeed={100}
                    loop
                />
                </div>
            </div>

            <p className='md:text-2xl text-xl font-bold text-gray-500 py-10'>
                Start your journey now{' '}
                <span className='inline-block text-3xl transform rotate-12'>🚀</span>
            </p>

            <div className=''>
                <Link to={'/auth/register'}>
                <Button className='w-[200px] rounded-full py-3 bg-green-400 transition duration-300 ease-in-out transform hover:scale-110 hover:text-accent-foreground dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8]'>
                    <span className='font-bold text-background'>Get Started</span>
                </Button>
                </Link>
            </div>
        </div>
    );
};

export default MainContent;