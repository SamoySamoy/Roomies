import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

type Props = {};

const ChatPage = (props: Props) => {
  return (
    <div>
      <Link to={'/'}>
        <Button variant={'outline'}>To landing page</Button>
      </Link>
    </div>
  );
};

export default ChatPage;
