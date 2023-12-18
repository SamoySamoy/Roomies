import React from 'react';
// import { Scrollama, Step } from 'react-scrollama';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ctaImage from '@/assets/cta.png';

const CTA = () => {
  // const [currentStep, setCurrentStep] = useState(0);

  // const onStepEnter = ({ data }) => {
  //   setCurrentStep(data);
  // };

  return (
    <div className='w-full py-24'>
    <div className='md:max-w-[1480px] m-auto grid md:grid-cols-2 gap-8 max-w-[600px] items-center  px-4 md:px-0'>   
      {/* <Scrollama onStepEnter={onStepEnter}>
        <Step data={1}>
          <div className={`w-[650px] mx-auto transform translate-y-${currentStep * 20}`} style={{ transition: 'transform 0.5s ease-in-out' }}>
            <img src={ctaImage} className='w-full rounded-lg shadow-lg' alt='CTA' />
          </div>
        </Step>
      </Scrollama>  */}
      <img src={ctaImage} className="w-[650px] mx-auto transform translate-y-4 hover:translate-y-0 transition-transform duration-300" />        
      <div>
        <h1 className='py-2  text-3xl font-semibold'>Join <span className='text-green-400'>World's largest</span> learning platform today </h1>
        <p className='py-2 text-lg text-gray-500'>Start learning by registering for free</p>
        <Link to={'/auth/register'}>
          <Button className='max-[780px]:w-full my-4 px-8 py-5 rounded-md bg-green-400 text-white font-bold'>
            <span>Sign Up Now</span>
          </Button>
        </Link>             
      </div>
    </div>
</div>
  )
}

export default CTA