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
      const threshold = 580;
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

      <div
        className={`${
          isTop ? 'fixed top-0 w-full z-50' : ''
        } transition-all duration-300 ease-in-out bg-black shadow-lg`}
      >
        <nav className='flex justify-evenly items-center py-4'>
          <ScrollLink
            to='ability'
            smooth={true}
            className={`text-white transition duration-300 ease-in-out transform hover:scale-110 hover:underline hover:text-emerald-400 rounded-full cursor-pointer`}
          >
            Features
          </ScrollLink>
          <ScrollLink
            to='categories'
            smooth={true}
            className={`text-white transition duration-300 ease-in-out transform hover:scale-110 hover:underline hover:text-emerald-400 rounded-full cursor-pointer`}
          >
            Explore The Topic
          </ScrollLink>
          <ScrollLink
            to='server'
            smooth={true}
            className={`text-white transition duration-300 ease-in-out transform hover:scale-110 hover:underline hover:text-emerald-400 rounded-full cursor-pointer`}
          >
            Server Info
          </ScrollLink>
          <ScrollLink
            to='footer'
            smooth={true}
            className={`text-white transition duration-300 ease-in-out transform hover:scale-110 hover:underline hover:text-emerald-400 rounded-full cursor-pointer`}
          >
            About Us
          </ScrollLink>
        </nav>
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
