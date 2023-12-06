import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

type Props = {};

const LandingPage = (props: Props) => {
  return (
    <div>
      <ThemeToggle />
      <Link to={'/chat'}>
        <Button>To chat page</Button>
      </Link>
    </div>
  );
};

export default LandingPage;
