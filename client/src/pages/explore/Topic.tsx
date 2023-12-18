import React from "react";

const Topic = ({ title, icon }: any) => {
  return (
    <div className="flex text-[#b5bac1] items-center text-[16px]">
      <button autoFocus={title === 'Home' ? true : false} className="flex items-center hover:bg-[#5865f2] hover:text-white focus:bg-[#5865f2] focus:text-white focus:outline-none  w-full py-2.5 rounded-[0.4rem] font-semibold duration-100 ease-out ">
        <div className="pl-4 text-[25px]">{icon}</div>
        <p className="ml-2">{title}</p>
      </button>
    </div>
  );
};

export default Topic;
