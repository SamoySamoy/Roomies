import CategoryCard from './CategoryCard';
import {
  Cpu,
  Dumbbell,
  FlaskConical,
  LucideBook,
  LucideCode,
  LucideFilm,
  LucideGamepad,
  LucideGuitar,
  MapPin,
  Music,
  Pizza,
  Wrench,
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Element } from 'react-scroll';

const Categories = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  return (
    <Element
      name='categories'
      className={`${
        inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-40'
      } transform transition ease-in-out duration-700 `}
    >
      <div className='w-full pb-20 px-20'>
        <div className='md:max-w-[1480px] m-auto max-w-[600px] px-4 md:px-0'>
          <h1 className='md:leading-[72px] text-3xl font-bold'>
            Explore a variety of <span className='text-emerald-500'>Communities</span> by topic
          </h1>
          <div ref={ref}>
            <div className='grid lg:grid-cols-4 grid-cols-2 py-12 md:gap-4 gap-1'>
              <CategoryCard icons={<LucideGamepad size={30} />} title={'Gaming'} />
              <CategoryCard icons={<Music size={30} />} title={'Music'} />
              <CategoryCard icons={<LucideBook size={30} />} title={'Education'} />
              <CategoryCard icons={<Cpu size={30} />} title={'Technology'} />
              <CategoryCard icons={<FlaskConical size={30} />} title={'Science'} />
              <CategoryCard icons={<Dumbbell size={30} />} title={'Sport'} />
              <CategoryCard icons={<LucideGuitar size={30} />} title={'Art'} />
              <CategoryCard icons={<LucideFilm size={30} />} title={'Movies'} />
              <CategoryCard icons={<MapPin size={30} />} title={'Travel'} />
              <CategoryCard icons={<LucideCode size={30} />} title={'Literature'} />
              <CategoryCard icons={<Pizza size={30} />} title={'Food'} />
              <CategoryCard icons={<Wrench size={30} />} title={'DIY'} />
            </div>
          </div>
          <p className='text-lg text-gray-600'>
            Roomies builds many communities with different topics.
          </p>
        </div>
      </div>
    </Element>
  );
};

export default Categories;
