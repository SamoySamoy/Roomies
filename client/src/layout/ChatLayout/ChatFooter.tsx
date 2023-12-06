import React from 'react';

type Props = {};

const ChatFooter = (props: Props) => {
  return (
    <div className='flex flex-row h-16 w-full bg-background justify-center'>
      <p className='text-foreground'>This is a footer</p>
    </div>
  );
};

export default ChatFooter;
