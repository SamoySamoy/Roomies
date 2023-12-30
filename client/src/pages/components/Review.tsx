import { useInView } from 'react-intersection-observer';
import { Element } from 'react-scroll';
import { useState } from 'react';

const reviews_1 = [
  {
    id: 1,
    author: 'John Doe',
    content: 'Excellent for design collaboration! The channels and categories make it easy to organize discussions. A must-have for graphic designers.',
    
    job: 'Web Developer',
  },
  {
    id: 2,
    author: 'Jane Smith',
    content: 'I\'m impressed with the service! Fast delivery of messages and a great environment for collaboration. Highly recommended for any marketing team.',
    job: 'Marketing Specialist',
  },
  {
    id: 3,
    author: 'Alice Johnson',
    content: 'Outstanding communication platform! The features are incredible, and the user interface is intuitive. Perfect for connecting with teammates and friends.',
    job: 'Graphic Designer',
  },
  {
    id: 4,
    author: 'Bob Anderson',
    content: 'Great for software development! The real-time communication and integrations with other tools make it an essential part of our workflow. Excellent customer support too.',
    job: 'Software Engineer',
  },
];

const reviews_2 = [
  {
    id: 1,
    author: 'Eva Brown',
    content: 'Satisfied with the purchase! Seamless experience for data analysts. Impressive customization options.',
    job: 'UX/UI Designer',
  },
  {
    id: 2,
    author: 'Chris White',
    content: 'Good for team coordination! Reliable voice and video call features, reasonable pricing. A valuable tool for project managers.',
    job: 'Project Manager',
  },
  {
    id: 3,
    author: 'Olivia Green',
    content: 'Efficient for project management! Quick response time and file sharing make it ideal for UX/UI designers. Very user-friendly.',
    job: 'Data Analyst',
  },
  {
    id: 4,
    author: 'David Taylor',
    content: 'Excellent for financial analysis! Stable platform with security features meeting the needs of financial analysts. Prompt delivery of messages and notifications.',
    job: 'Financial Analyst',
  },
];

const reviews_3 = [
  {
    id: 1,
    author: 'Sophie Martinez',
    content: 'Perfect for content creation! Organized channels and community features are excellent for content writers. The platform has exceeded my expectations.',
    job: 'Content Writer',
  },
  {
    id: 2,
    author: 'Michael Clark',
    content: 'Great value for sales teams! Offers excellent value for sales representatives. Integrations with CRM systems make it a powerful tool.',
    job: 'Sales Representative',
  },
  {
    id: 3,
    author: 'Emma Lewis',
    content: 'Fantastic experience for customer support! Ability to resolve customer inquiries in real-time is invaluable for customer support specialists. Highly recommended.',
    job: 'Customer Support Specialist',
  },
  {
    id: 4,
    author: 'Ryan Johnson',
    content: 'Amazing for IT support! Streamlined IT support processes with quick responses and effective communication with the team.',
    job: 'IT Support Technician',
  },
];

const reviews_4 = [
  {
    id: 1,
    author: 'John Doe',
    content: 'Great for design collaboration!',
    job: 'Web Developer',
  },
  {
    id: 2,
    author: 'Jane Smith',
    content: 'Impressed with the service! Highly recommended.',
    job: 'Marketing Specialist',
  },
  {
    id: 3,
    author: 'Alice Johnson',
    content: 'Outstanding communication platform! Perfect for connecting.',
    job: 'Graphic Designer',
  },
  {
    id: 4,
    author: 'Bob Anderson',
    content: 'Great for software development! Essential part of our workflow.',
    job: 'Software Engineer',
  },
];

const ReviewItem = ({ content, author, job }: { content: string, author: string, job: string }) => (
  <li className='text-sm leading-6'>
    <figure className='relative flex flex-col-reverse bg-slate-50 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5'>
      <blockquote className='mt-6 text-slate-700 dark:text-slate-300'>
        <p>{content}</p>
      </blockquote>
      <figcaption className='flex items-center space-x-4'>
        <img src="/_next/static/media/ryan-florence.3af9c9d9.jpg" alt="" className="flex-none w-14 h-14 rounded-full object-cover" loading="lazy" decoding="async" />
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

  const [visibleReviews, setVisibleReviews] = useState(3); // Số lượng review hiển thị ban đầu

  const showMoreReviews = () => {
    // Tăng số lượng review hiển thị khi người dùng nhấp vào "Show more"
    setVisibleReviews((prevVisibleReviews) => prevVisibleReviews + 1);
  };
  
  return (
    <Element name='server' className={`${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-40'} transform transition ease-in-out duration-1000 `}>
      <div className='w-full pb-20 px-20'>
        <div className='md:max-w-[1480px] m-auto max-w-[600px] px-10 py-10 border border-zinc-800 bg-zinc-900 rounded-3xl'>
          <h2 className="md:leading-[72px] text-3xl font-bold text-center mb-8">User Reviews</h2>
          <div ref={ref}>
            <div className='relative focus:outline-none'>
              <div className="grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden">
                <ul className="space-y-8">
                  {reviews_4.slice(0, visibleReviews).map((review) => (
                    <ReviewItem key={review.id} content={review.content} author={review.author} job={review.job} />
                  ))}
                </ul>
                <ul className="space-y-8 hidden sm:block">
                  {reviews_2.slice(0, visibleReviews).map((review) => (
                    <ReviewItem key={review.id} content={review.content} author={review.author} job={review.job} />
                  ))}
                </ul>
                <ul className="space-y-8 hidden lg:block">
                  {reviews_3.slice(0, visibleReviews).map((review) => (
                    <ReviewItem key={review.id} content={review.content} author={review.author} job={review.job} />
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