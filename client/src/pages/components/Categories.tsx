import CategoryCard from './CategoryCard';
import { BsBook, BsMusicNote } from 'react-icons/bs';
import { FaGamepad, FaReact } from 'react-icons/fa';

const Categories = () => {
  return (
    <div className='w-full py-24'>
      <div className='md:max-w-[1480px] m-auto max-w-[600px]  px-4 md:px-0'>
        <h1 className='md:leading-[72px] text-3xl font-bold'>
          Explore a variety of <span className='text-green-400'>Communities</span> by topic
        </h1>
        <div className='grid lg:grid-cols-4 grid-cols-2 py-12 md:gap-4 gap-1'>
          <CategoryCard icons={<FaGamepad size={30} />} title={'Gaming'} />
          <CategoryCard icons={<BsMusicNote size={30} />} title={'Music'} />
          <CategoryCard icons={<BsBook size={30} />} title={'Education'} />
          <CategoryCard icons={<FaReact size={30} />} title={'Science'} />
        </div>
        <p className='text-lg text-gray-600'>
          Roomies builds many communities with different topics.
        </p>
      </div>
    </div>
  );
};

export default Categories;
