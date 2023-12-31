const CategoryCard = ({ icons, title }) => {
  return (
    <div
      className='md:p-4 p-2 shadow-lg rounded-xl flex items-center gap-4 justify-between border border-transparent hover:border-green-500 hover:cursor-pointer
    pl-2 py-2 flex-row border-neutral-300 bg-zinc-100 drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] duration-300 hover:scale-105 hover:shadow-[2rem_2rem_2rem_-1rem_#0004,inset_1rem_1rem_4rem_-1rem_#fff1] dark:border-zinc-800 dark:bg-zinc-900 dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.35)] dark:hover:border-green-500 bis_skin_checked="1"'
    >
      <div>{icons}</div>
      <div className='flex items-center flex-1 justify-center'>{title}</div>
    </div>
  );
};

export default CategoryCard;
