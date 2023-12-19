import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import MainContent from './components/MainContent';
import Ability from './components/Ability';
import Categories from './components/Categories';
import CTA from './components/CTA';
import Footer from './components/Footer';

type Props = {};

const LandingPage = (props: Props) => {
  return (
    <div className='p-10'>
      {/* <Link to={'/explore'}>
        <Button>To Explore page</Button>
      </Link>
      <Link to={'/rooms/12345'}>
        <Button>To Rooms page</Button>
      </Link>
      <Link to={'/auth/login'}>
        <Button>To Login page</Button>
      </Link>
      <Link to={'/auth/register'}>
        <Button>To Register page</Button>
      </Link> */}
      {/* <p className='text-background'>background</p>
      <p className='text-foreground'>foreground</p>
      <p className='text-card'>card</p>
      <p className='text-card-foreground'>card-foreground</p>
      <p className='text-popover'>popover</p>
      <p className='text-popover-foreground'>popover-foreground</p>
      <p className='text-primary'>primary</p>
      <p className='text-primary-foreground'>primary-foreground</p>
      <p className='text-secondary'>secondary</p>
      <p className='text-secondary-foreground'>secondary-foreground</p>
      <p className='text-muted'>muted</p>
      <p className='text-muted-foreground'>muted-foreground</p>
      <p className='text-accent'>accent</p>
      <p className='text-accent-foreground'>accent-foreground</p>
      <p className='text-destructive'>destructive</p>
      <p className='text-destructive-foreground'>destructive-foreground</p>
      <p className='text-border'>border</p>
      <p className='text-input'>input</p>
      <p className='text-ring'>ring</p>
      <p className='text-radius'>radius</p> */}
      <MainContent />
      <Ability />
      <Categories />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
