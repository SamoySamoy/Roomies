import { FaGlobe, FaLock, FaPlug, FaUsers, FaClock } from 'react-icons/fa';
import './style.css';

const Categories = () => {
  return (
    <div>
      <div className='py-20 border-2 px-10 mx-20 rounded-3xl hero-join-button'>
        <h1 className='md:leading-[72px] text-3xl font-bold'>
          We have <span className='text-emerald-400'>Powerful Server</span>
        </h1>
        <div className='mx-auto grid md:grid-cols-5 gap-4'>
          {[
            { icon: <FaGlobe size={30} />, text: 'Crystal-Clear Voice Channels' },
            { icon: <FaLock size={30} />, text: 'Robust Security and Privacy Measures' },
            { icon: <FaPlug size={30} />, text: 'Extensive Integration Support' },
            { icon: <FaUsers size={30} />, text: 'Innovative Community Building Tools' },
            { icon: <FaClock size={30} />, text: 'Reliable Uptime and Low Latency' },
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
  );
};

export default Categories;
