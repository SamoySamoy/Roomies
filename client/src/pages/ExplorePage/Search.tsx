import hero from '../../assets/img/hero2.webp';
import { SearchIcon } from 'lucide-react';
import React from 'react';

interface SearchProps {
  search: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search = ({ search, onChange }: SearchProps) => {
  return (
    <div className='relative h-[200px] sm:h-[240px] md:h-[280px] rounded-lg z-10'>
      {/* Background Image */}
      <div className='absolute flex w-full '>
        <img
          src={hero}
          className='object-cover w-full h-[200px] sm:h-[240px] md:h-[280px] rounded-lg'
        />
      </div>
      {/* Overlay */}
      <div className='absolute flex w-full h-full bg-black/20 z-10'></div>

      {/* Search */}
      <div className='relative z-20 flex flex-col items-center justify-center h-full font-bold text-white pb-0 gap-y-2'>
        <p className='text-xl md:text-2xl font-black'>Find your friends, communities on Roomies</p>
        <p className='pb-2 text-base md:text-lg text-white/70'>
          From gaming, to music, to study, there's a place for you.
        </p>
        <div className='flex items-center w-[300px] sm:w-[450px] md:w-[600px] mb-4 px-4 rounded-md bg-white'>
          <input
            type='search '
            value={search}
            onChange={onChange}
            placeholder='Explore roomies'
            className='flex-1 rounded-lg placeholder:text-base md:placeholder:text-lg placeholder:text-gray-400 outline-0 py-2 md:py-3 text-black'
          />
          <SearchIcon className='text-slate-700' />
        </div>
      </div>
    </div>
  );
};

export default Search;
