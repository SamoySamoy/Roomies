import { useInView } from 'react-intersection-observer';
import { Element } from 'react-scroll';
import { useState } from 'react';
import img1 from '@/assets/avatar/ava1.jpg'
import img2 from '@/assets/avatar/ava2.jpg'
import img3 from '@/assets/avatar/ava3.jpg'
import img4 from '@/assets/avatar/ava4.jpg'
import img5 from '@/assets/avatar/ava5.jpg'
import img6 from '@/assets/avatar/ava6.jpg'
import img7 from '@/assets/avatar/ava7.jpg'
import img8 from '@/assets/avatar/ava8.jpg'
import img9 from '@/assets/avatar/ava9.jpg'
import img10 from '@/assets/avatar/ava10.jpg'
import img11 from '@/assets/avatar/ava11.jpg'
import img12 from '@/assets/avatar/ava12.jpg'

const reviews_2 = [
  {
    id: 1,
    avatar: img1,
    author: 'Eva Brown',
    content: 'Satisfied with the purchase! Seamless experience for data analysts. Impressive customization options.',
    job: 'UX/UI Designer',
  },
  {
    id: 2,
    avatar: img2,
    author: 'Chris White',
    content: 'Good for team coordination! Reliable voice and video call features, reasonable pricing. A valuable tool for project managers.',
    job: 'Project Manager',
  },
  {
    id: 3,
    avatar: img3,
    author: 'Olivia Green',
    content: 'Efficient for project management! Quick response time and file sharing make it ideal for UX/UI designers. Very user-friendly.',
    job: 'Data Analyst',
  },
  {
    id: 4,
    avatar: img4,
    author: 'David Taylor',
    content: 'Excellent for financial analysis! Stable platform with security features meeting the needs of financial analysts. Prompt delivery of messages and notifications.',
    job: 'Financial Analyst',
  },
];

const reviews_3 = [
  {
    id: 1,
    avatar: img5,
    author: 'Sophie Martinez',
    content: 'Perfect for content creation! Organized channels and community features are excellent for content writers. The platform has exceeded my expectations.',
    job: 'Content Writer',
  },
  {
    id: 2,
    avatar: img6,
    author: 'Michael Clark',
    content: 'Great value for sales teams! Offers excellent value for sales representatives. Integrations with CRM systems make it a powerful tool.',
    job: 'Sales Representative',
  },
  {
    id: 3,
    avatar: img7,
    author: 'Emma Lewis',
    content: 'Fantastic experience for customer support! Ability to resolve customer inquiries in real-time is invaluable for customer support specialists. Highly recommended.',
    job: 'Customer Support Specialist',
  },
  {
    id: 4,
    avatar: img8,
    author: 'Ryan Johnson',
    content: 'Amazing for IT support! Streamlined IT support processes with quick responses and effective communication with the team.',
    job: 'IT Support Technician',
  },
];

const reviews_4 = [
  {
    id: 1,
    avatar: img9,
    author: 'John Doe',
    content: 'Great for design collaboration!',
    job: 'Web Developer',
  },
  {
    id: 2,
    avatar: img10,
    author: 'Jane Smith',
    content: 'Impressed with the service! Highly recommended.',
    job: 'Marketing Specialist',
  },
  {
    id: 3,
    avatar: img11,
    author: 'Alice Johnson',
    content: 'Outstanding communication platform! Perfect for connecting.',
    job: 'Graphic Designer',
  },
  {
    id: 4,
    avatar: img12,
    author: 'Bob Anderson',
    content: 'Great for software development! Essential part of our workflow.',
    job: 'Software Engineer',
  },
];

const ReviewItem = ({ avatar, content, author, job }: { avatar: string, content: string, author: string, job: string }) => (
  <li className='text-sm leading-6'>
    <figure className='relative flex flex-col-reverse rounded-lg p-6 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 dark:highlight-white/5 duration-300  hover:scale-105 hover:shadow-[-2rem_-2rem_2rem_-1rem_#0004,inset_1rem_1rem_4rem_-1rem_#fff4]'>
      <blockquote className='mt-6 text-slate-700 dark:text-slate-300'>
        <p>{content}</p>
      </blockquote>
      <figcaption className='flex items-center space-x-4'>
        <img src={avatar} alt="" className="flex-none w-14 h-14 rounded-full object-cover" loading="lazy" decoding="async" />
        <div className='flex-auto'>
          <div className='text-base text-slate-900 font-semibold dark:text-slate-300'>
            {author}
          </div>
          <div className='mt-0.5'>
            {job}
          </div>
        </div>
      </figcaption>
    </figure>
  </li>
);

const Review = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
  });

  const [visibleReviews, setVisibleReviews] = useState(3);

  const showMoreReviews = () => {
    setVisibleReviews((prevVisibleReviews) => prevVisibleReviews + 1);
  };
  
  return (
    <Element name='server' className={`${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-40'} transform transition ease-in-out duration-1000 `}>
      <div className='w-full pb-20 px-20'>
        <div className='md:max-w-[1480px] m-auto max-w-[600px] px-10 py-10 border border-zinc-600 bg-zinc-900 rounded-3xl'>
          <h2 className="md:leading-[72px] text-3xl font-bold text-center mb-8">User Reviews</h2>
          <div ref={ref}>
            <div className='relative focus:outline-none'>
              <div className="p-10 grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden">
                <ul className="space-y-8">
                  {reviews_2.slice(0, visibleReviews).map((review) => (
                    <ReviewItem key={review.id} avatar={review.avatar} content={review.content} author={review.author} job={review.job} />
                  ))}
                </ul>
                <ul className="space-y-8 hidden sm:block">
                  {reviews_3.slice(0, visibleReviews).map((review) => (
                    <ReviewItem key={review.id} avatar={review.avatar} content={review.content} author={review.author} job={review.job} />
                  ))}
                </ul>
                <ul className="space-y-8 hidden lg:block">
                  {reviews_4.slice(0, visibleReviews).map((review) => (
                    <ReviewItem key={review.id} avatar={review.avatar} content={review.content} author={review.author} job={review.job} />
                  ))}
                </ul>                 
              </div>
              {visibleReviews < reviews_4.length && (
                <div className='inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white pt-32 pb-8 pointer-events-none dark:from-slate-900 absolute'>
                  <button 
                    type='button' 
                    onClick={showMoreReviews}
                    className='relative bg-slate-900 hover:bg-slate-700:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 text-sm text-white font-semibold h-12 px-6 rounded-lg flex items-center dark:bg-slate-700 dark:hover:bg-slate-600 pointer-events-auto'>
                    Show more...
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Element>
  );
};

export default Review;