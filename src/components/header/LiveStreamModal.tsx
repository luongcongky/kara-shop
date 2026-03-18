import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiX } from 'react-icons/fi';

interface LiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const LiveStreamModal = ({ isOpen, onClose, videoId }: LiveStreamModalProps) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  const chatUrl = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${typeof window !== 'undefined' ? window.location.hostname : ''}`;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-[#1a1a1a] p-0 text-left align-middle shadow-2xl transition-all border border-neutral-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-3 bg-[#111]">
                  <Dialog.Title as="h3" className="text-sm font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    YouTube Live Stream
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex flex-col lg:flex-row aspect-video bg-black gap-0 overflow-hidden">
                  <div className="flex-[3] relative w-full h-[60vh] lg:h-full">
                    <iframe
                      src={embedUrl}
                      className="absolute inset-0 w-full h-full border-b lg:border-b-0 lg:border-r border-neutral-800"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex-1 w-full h-[30vh] lg:h-full bg-[#111]">
                    <iframe
                      src={chatUrl}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LiveStreamModal;
