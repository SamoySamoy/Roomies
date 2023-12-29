import img from '@/assets/img1.svg';
import { MessageCircleIcon, Mic, Users, Video } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Element } from 'react-scroll';

const Ability = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  return (
    <Element name='ability' className={`${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-40'} transform transition ease-in-out duration-1000 `}>
      <div ref={ref}>
        <div className='w-full py-20 px-20'>
          <div className='md:max-w-[1480px] m-auto grid md:grid-cols-2 max-w-[600px] md:px-0'>
            <div className='flex flex-col justify-center '>
              <h1 className='md:leading-[72px] text-3xl font-bold'>
                Create your own <span className='text-emerald-400'>Space</span>
              </h1>
              <p className='text-lg text-gray-600'>Roomies offers many chat channels</p>
              <div className='grid grid-cols-2 py-8 gap-8 justify-evenly w-[640px]'>
                <div className='pl-2 py-2 items-center flex flex-row rounded-2xl border border-neutral-300 bg-zinc-100 drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] duration-300 hover:-skew-x-3 hover:scale-105 hover:shadow-[2rem_2rem_2rem_-1rem_#0004,inset_1rem_1rem_4rem_-1rem_#fff1] dark:border-zinc-800 dark:bg-zinc-900 dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.35)] dark:hover:border-zinc-600 bis_skin_checked="1"'>
                  <div className='p-4 bg-[#E9F8F3] rounded-xl'>
                    <MessageCircleIcon size={30} className='text-emerald-400' />
                  </div>
                  <div className='px-3'>
                    <h1 className='text-2xl font-semibold'>Chat</h1>
                    <p className='text-[#6D737A]'>Chat freely,</p>
                    <p className='text-[#6D737A]'>express endlessly</p>
                  </div>
                </div>
                <div className='pl-2 py-2 items-center flex flex-row rounded-2xl border border-neutral-300 bg-zinc-100 drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] duration-300 hover:-skew-x-3 hover:scale-105 hover:shadow-[2rem_2rem_2rem_-1rem_#0004,inset_1rem_1rem_4rem_-1rem_#fff1] dark:border-zinc-800 dark:bg-zinc-900 dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.35)] dark:hover:border-zinc-600 bis_skin_checked="1"'>
                  <div className='p-4 bg-[#FFFAF5] rounded-xl'>
                    <Video size={30} className='text-yellow-400' />
                  </div>
                  <div className='px-3'>
                    <h1 className='text-2xl font-semibold'>Video</h1>
                    <p className='text-[#6D737A]'>Video connections,</p>
                    <p className='text-[#6D737A]'>bridging distances</p>
                  </div>
                </div>
                <div className='pl-2 py-2 items-center flex flex-row rounded-2xl border border-neutral-300 bg-zinc-100 drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] duration-300 hover:-skew-x-3 hover:scale-105 hover:shadow-[2rem_2rem_2rem_-1rem_#0004,inset_1rem_1rem_4rem_-1rem_#fff1] dark:border-zinc-800 dark:bg-zinc-900 dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.35)] dark:hover:border-zinc-600 bis_skin_checked="1"'>
                  <div className='p-4 bg-[#FFEEF0] rounded-xl'>
                    <Mic size={30} className='text-red-400' />
                  </div>
                  <div className='px-3'>
                    <h1 className='text-2xl font-semibold'>Voice</h1>
                    <p className='text-[#6D737A]'>Speak your mind,</p>
                    <p className='text-[#6D737A]'>hear the world</p>
                  </div>
                </div>
                <div className='pl-2 py-2 items-center flex flex-row rounded-2xl border border-neutral-300 bg-zinc-100 drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] duration-300 hover:-skew-x-3 hover:scale-105 hover:shadow-[2rem_2rem_2rem_-1rem_#0004,inset_1rem_1rem_4rem_-1rem_#fff1] dark:border-zinc-800 dark:bg-zinc-900 dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.35)] dark:hover:border-zinc-600 bis_skin_checked="1"'>
                  <div className='p-4 bg-[#F0F7FF] rounded-xl'>
                    <Users size={30} className='text-blue-400' />
                  </div>
                  <div className='px-3'>
                    <h1 className='text-2xl font-semibold'>Private Chat</h1>
                    <p className='text-[#6D737A]'>Private conversations,</p>
                    <p className='text-[#6D737A]'>your way</p>
                  </div>
                </div>
              </div>
            </div>

            <img
              src={img}
              className='m-auto md:order-last order-first transform translate-y-4 hover:translate-y-0 transition-transform duration-300 mt-36'
            />
          </div>
        </div>
      </div>
    </Element>
    
  );
};

export default Ability;
