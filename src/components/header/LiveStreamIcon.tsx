import { useState } from 'react';
import { RiRadioLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import LiveStreamModal from './LiveStreamModal';

interface LiveStreamIconProps {
  isActive: boolean;
  videoId: string;
}

const LiveStreamIcon = ({ isActive, videoId }: LiveStreamIconProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (isActive) {
      setIsModalOpen(true);
    } else {
      toast.error('Hiện tại chưa có Live stream. Vui lòng quay lại sau!', {
        icon: '📺',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`group relative flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all
          ${isActive 
            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 ring-1 ring-red-500/50 hover:ring-red-500' 
            : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700 grayscale'
          }
        `}
      >
        {isActive && (
          <span className="absolute -inset-0.5 rounded-full bg-red-500/20 animate-pulse" />
        )}
        <RiRadioLine size={14} className={isActive ? 'animate-bounce' : ''} />
        <span>Live</span>
      </button>

      {isActive && (
        <LiveStreamModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoId={videoId}
        />
      )}
    </>
  );
};

export default LiveStreamIcon;
