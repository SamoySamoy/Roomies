import { useEffect, useState } from 'react';
import { Link as ScrollLink, Element } from 'react-scroll';
import MainContent from './components/MainContent';
import Ability from './components/Ability';
import Categories from './components/Categories';
import Server from './components/Server';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';

const LandingPage = () => {
  const [isTop, setIsTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 820;
      setIsTop(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='relative bg-gray-950'>
      <MainContent />

      <div className=''>
        <div className='py-20 px-20'>
          <h1 className='py-2  text-3xl font-semibold'>
            What's special about <span className='text-emerald-400'> Roomies </span> ?
          </h1>
        </div>

        <div
          className={`${
            isTop 
            ? 'bg-black fixed top-0 w-full z-50 py-4 px-20' 
            : 'relative px-20'
          } transition-all duration-300 ease-in-out justify-evenly items-center w-full grid grid-cols-4 gap-x-8 gap-y-4 grid-rows-auto`}
        >
          <ScrollLink
            to='ability'
            smooth={true}
            className={`text-white transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer ${
              isTop 
              ? 'flex items-center justify-center hover:text-green-400 hover:underline' 
              : 'bg-zinc-900 py-6 flex items-center justify-center rounded-2xl border border-zinc-600 dark:hover:border-zinc-600 shadow-[0_0_2rem_-0.5rem_#fff8]'
            }`}
          >
            Features
          </ScrollLink>

          <ScrollLink
            to='categories'
            smooth={true}
            className={`text-white transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer ${
              isTop 
              ? 'flex items-center justify-center hover:text-green-400 hover:underline' 
              : 'bg-zinc-900 py-6 flex items-center justify-center rounded-2xl border border-zinc-600 dark:hover:border-zinc-600 shadow-[0_0_2rem_-0.5rem_#fff8]'
            }`}
          >
            Explore The Topic
          </ScrollLink>

          <ScrollLink
            to='server'
            smooth={true}
            className={`text-white transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer ${
              isTop 
              ? 'flex items-center justify-center hover:text-green-400 hover:underline' 
              : 'bg-zinc-900 py-6 flex items-center justify-center rounded-2xl border border-zinc-600 dark:hover:border-zinc-600 shadow-[0_0_2rem_-0.5rem_#fff8]'
            }`}
          >
            Server Info
          </ScrollLink>

          <ScrollLink
            to='footer'
            smooth={true}
            className={`text-white transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer ${
              isTop 
              ? 'flex items-center justify-center hover:text-green-400 hover:underline' 
              : 'bg-zinc-900 py-6 flex items-center justify-center rounded-2xl border border-zinc-600 dark:hover:border-zinc-600 shadow-[0_0_2rem_-0.5rem_#fff8]'
            }`}
          >
            About Us
          </ScrollLink>
        </div>
      </div>


      <Element name='ability'>
        <Ability />
      </Element>
      <Element name='categories'>
        <Categories />
      </Element>
      <Element name='server'>
        <Server />
      </Element>
      <Element name='cta'>
        <CTA />
      </Element>
      <Element name='footer'>
        <Footer />
      </Element>

      <ScrollToTopButton />
    </div>
  );
};

export default LandingPage;
