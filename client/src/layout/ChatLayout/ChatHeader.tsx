import ThemeToggle from '@/components/ThemeToggle';

type Props = {};

const ChatHeader = (props: Props) => {
  return (
    <div className='flex flex-row h-16 w-full bg-background justify-center'>
      <ThemeToggle />
    </div>
  );
};

export default ChatHeader;
