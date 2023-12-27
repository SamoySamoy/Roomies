import React from 'react';
import Discover from './Discover';
import Groups from './Groups';
import MainComponent from './MainComponent';

const ExplorePage = () => {
  return (
    <div className='flex bg-[#393943] '>
      {/* Friends + Groups */}
      <Groups />
      {/* Discover */}
      <Discover />
      {/* Main Content */}
      <MainComponent />
      {/* Hero */}
      {/* Featured */}
    </div>
  );
};

export default ExplorePage;
