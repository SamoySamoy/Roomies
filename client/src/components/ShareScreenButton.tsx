import qs from 'query-string';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MonitorUp, MonitorX } from 'lucide-react';

import ActionTooltip from '@/components/ActionToolTip';
import { useState } from 'react';

const ShareScreenButton = () => {
  // const pathname = usePathname();
  // const router = useRouter();
  // const searchParams = useSearchParams();

  // const isVideo = searchParams?.get('video');
  const [screen, setScreen] = useState(false);
  // const Icon = cam ? VideoOff : Video;
  const tooltipLabel = !screen ? 'Share your screen' : 'Stop sharing screen';

  return (
    <ActionTooltip side='top' label={tooltipLabel}>
      <button className={`flex items-center justify-center w-12 h-12 rounded-full ${!screen? 'bg-gray-700' : 'bg-blue-500'}  focus:outline-none`}
   onClick={() => setScreen(!screen)}>
    {
      !screen
      ? <MonitorUp color='white' size={27}></MonitorUp>
      : <MonitorX color='white' size={27}></MonitorX>
    }
   </button>
    </ActionTooltip>
  );
};

export default ShareScreenButton;
