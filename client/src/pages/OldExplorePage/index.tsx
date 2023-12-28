import Discover from './Discover';
import Groups from './Groups';
import MainComponent from './MainComponent';

const ExplorePage = () => {
  return (
    <div className='flex bg-[#393943] '>
      <Groups />
      {/* <Discover /> */}
      <MainComponent />
    </div>
  );
};

export default ExplorePage;
