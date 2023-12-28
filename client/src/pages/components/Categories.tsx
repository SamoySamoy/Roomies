import CategoryCard from './CategoryCard'
import {BsBook, BsMusicNote} from 'react-icons/bs'
import { FaBasketballBall, FaBookOpen, FaFilm, FaFlask, FaGamepad, FaGuitar, FaPizzaSlice, FaPlaneDeparture, FaReact, FaTools } from 'react-icons/fa'

const Categories = () => {
  return (
    <div className='w-full py-20 px-20'>
      <div className='md:max-w-[1480px] m-auto max-w-[600px] px-4 md:px-0'>
          <h1 className='md:leading-[72px] text-3xl font-bold'>Explore a variety of <span className='text-green-400'>Communities</span>  by topic</h1>
          <div className='grid lg:grid-cols-4 grid-cols-2 py-12 md:gap-4 gap-1'>
            <CategoryCard icons={<FaGamepad size={30} />} title={'Gaming'} />
            <CategoryCard icons={<BsMusicNote size={30} />} title={'Music'} />
            <CategoryCard icons={<BsBook size={30} />} title={'Education'} />
            <CategoryCard icons={<FaReact size={30} />} title={'Technology'} />
            <CategoryCard icons={<FaFlask size={30} />} title={'Science'} />
            <CategoryCard icons={<FaBasketballBall size={30} />} title={'Sport'} />
            <CategoryCard icons={<FaGuitar size={30} />} title={'Art'} />
            <CategoryCard icons={<FaFilm size={30} />} title={'Movies'} />
            <CategoryCard icons={<FaPlaneDeparture size={30} />} title={'Travel'} />
            <CategoryCard icons={<FaBookOpen size={30} />} title={'Literature'} />
            <CategoryCard icons={<FaPizzaSlice size={30} />} title={'Food'} />
            <CategoryCard icons={<FaTools size={30} />} title={'DIY'} />
          </div>
          <p className='text-lg text-gray-600'>Roomies builds many communities with different topics.</p>
      </div>
    </div>
  )
}

export default Categories