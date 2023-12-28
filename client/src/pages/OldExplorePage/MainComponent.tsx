
import Featured from "./Featured";
import Search from "./Search";

const MainComponent = () => {
  return (
    <div className="bg-[#393943] w-full px-5 pt-4">
      {/* Hero  */}
      <Search />
      {/* Featured Servers */}
      <Featured />
    </div>
  );
};

export default MainComponent;
