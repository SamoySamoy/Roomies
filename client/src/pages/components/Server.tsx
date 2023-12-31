import './style.css';
import { Clock, Globe, Lock, Plug, User } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Element } from 'react-scroll';

const Categories = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  return (
    <Element name='server' className={`${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-40'} transform transition ease-in-out duration-1000 `}>
      <div className='w-full pb-20'>
        <div className='py-20 border-2 px-10 mx-20 rounded-3xl hero-join-button'>
          <h1 className='md:leading-[72px] text-3xl font-bold'>
            We have <span className='text-green-500'>Powerful Server</span>
          </h1>
          <div ref={ref}>
            <div className='mx-auto grid md:grid-cols-5 gap-4'>
              {[
                { icon: <Globe size={30} />, text: 'Crystal-Clear Voice Channels' },
                { icon: <Lock size={30} />, text: 'Robust Security and Privacy Measures' },
                { icon: <Plug size={30} />, text: 'Extensive Integration Support' },
                { icon: <User size={30} />, text: 'Innovative Community Building Tools' },
                { icon: <Clock size={30} />, text: 'Reliable Uptime and Low Latency' },
              ].map((item, index) => (
                <div
                  key={index}
                  className='relative overflow-hidden rounded transition-transform duration-300 ease-in-out hover:scale-105'
                >
                  <div className='flex flex-col items-center justify-center h-full p-8 bg-zinc-900 rounded-2xl'>
                    {item.icon}
                    <div className='text-center'>
                      <p className='py-2 border-b-2 '>
                        <span className='text-sm italic text-[#6D737A]'>{item.text}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Element>
  );
};

export default Categories;
