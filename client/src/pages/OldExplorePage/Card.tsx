const Card = ({ online, members, description, title, profile, bg }: any) => {
  return (
    <div className='w-full  '>
      {/* Banner  */}
      <div className='  h-40 flex  w-full'>
        <img src={bg} className='rounded-t-[0.8rem] object-cover w-full' />
      </div>
      <div className='bg-[#292b2f] relative h-[11.5rem] px-[1rem] rounded-b-[0.8rem] '>
        {/* Profile Pic  */}
        <div className='absolute -top-8  left-4 w-16 h-16 flex rounded-[1rem] p-1 bg-[#292b2f]'>
          <img src={profile} className='object-cover rounded-[1rem]' />
        </div>
        {/* Title  */}
        <p className='text-white font-bold text-[17px] pt-9'>{title}</p>
        {/* Description  */}
        <p className=' text-gray-400 font-medium text-[15px] pt-1'>{description}</p>
        {/* Active members */}
        <p className=' text-gray-400 font-medium text-[13.5px] pt-3 pb-4 '>
          <span className='text-emerald-400 text-lg'>● </span>
          {online}
          <span className='text-lg'>&emsp; ● </span>
          {members}
        </p>
      </div>
    </div>
  );
};

export default Card;
