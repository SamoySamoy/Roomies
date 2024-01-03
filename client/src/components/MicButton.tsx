import qs from 'query-string';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Mic, MicOff } from 'lucide-react';

import ActionTooltip from '@/components/ActionToolTip';
import { useState } from 'react';

const MicButton = () => {
  // const pathname = usePathname();
  // const router = useRouter();
  // const searchParams = useSearchParams();

  // const isVideo = searchParams?.get('video');
  const [mic, setMic] = useState(false);
  // const Icon = cam ? VideoOff : Video;
  const tooltipLabel = mic ? 'Turn off Microphone' : 'Turn on Microphone';

  return (
    <ActionTooltip side='top' label={tooltipLabel}>
      <button className={`flex items-center justify-center w-12 h-12 rounded-full ${mic? 'bg-gray-700' : 'bg-red-600'}  focus:outline-none`}
   onClick={() => setMic(!mic)}>
    {
      mic
      ? <Mic color='white' size={27}></Mic>
      : <MicOff color='white' size={27}></MicOff>
    }
   </button>
    </ActionTooltip>
  );
};

export default MicButton;
