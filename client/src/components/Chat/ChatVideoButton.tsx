import qs from 'query-string';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Video, VideoOff } from 'lucide-react';

import ActionTooltip from '@/components/ActionToolTip';
import { useState } from 'react';

const ChatVideoButton = () => {
  // const pathname = usePathname();
  // const router = useRouter();
  // const searchParams = useSearchParams();

  // const isVideo = searchParams?.get('video');
  const [cam, setCam] = useState(false);
  // const Icon = cam ? VideoOff : Video;
  const tooltipLabel = cam ? 'Turn off Camera' : 'Turn on Camera';

  return (
    <ActionTooltip side='top' label={tooltipLabel}>
      <button className={`flex items-center justify-center w-12 h-12 rounded-full ${cam ? 'bg-gray-700' : 'bg-red-600'} focus:outline-none`}
        onClick={() => setCam(!cam)}>
        {
          cam
            ? <Video color='white' size={27}></Video>
            : <VideoOff color='white' size={27}></VideoOff>
        }
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;
