import React from 'react';

export type CategoryCardProps = {
  icons: React.ReactNode;
  title: string;
};

const CategoryCard = ({ icons, title }: CategoryCardProps) => {
  return (
    <div
      className='md:p-4 p-2 shadow-lg rounded-xl flex flex-row items-center gap-4 justify-between border border-transparent duration-300
      border-zinc-800 bg-zinc-900
      dark:border-zinc-800 dark:bg-zinc-900 hover:border-emerald-500 dark:hover:border-emerald-500
      hover:cursor-pointer hover:scale-105 hover:shadow-[2rem_2rem_2rem_-1rem_#0004,inset_1rem_1rem_4rem_-1rem_#fff1]
      drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.35)] bis_skin_checked="1"'
    >
      <div className='text-white'>{icons}</div>
      <div className='flex items-center flex-1 justify-center text-white'>{title}</div>
    </div>
  );
};

export default CategoryCard;
