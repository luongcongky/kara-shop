import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiX } from 'react-icons/fi';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const PreviewModal = ({ isOpen, onClose, content }: PreviewModalProps) => {
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-3xl bg-white p-0 text-left align-middle shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 px-8 py-4 bg-zinc-50/50 font-sans">
                  <Dialog.Title as="h3" className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-100 text-orange-600 text-[10px] font-black">
                      P
                    </span>
                    Xem trước bài viết
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Content Area */}
                <div className="max-h-[80vh] overflow-y-auto px-8 py-10 bg-white">
                  <div className="mx-auto max-w-4xl preview-content">
                    <div className="prose prose-zinc max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                  </div>
                </div>

                {/* Footer bar */}
                <div className="border-t border-zinc-100 px-8 py-4 bg-zinc-50 text-[10px] text-zinc-400 font-bold uppercase tracking-wider text-center font-sans">
                  Đây là chế độ xem trước. Giao diện thực tế có thể thay đổi tùy theo thiết bị.
                </div>

                <style jsx global>{`
                  .preview-content .prose {
                    --tw-prose-body: currentColor;
                    --tw-prose-headings: currentColor;
                    --tw-prose-bold: currentColor;
                    --tw-prose-bullets: currentColor;
                    --tw-prose-counters: currentColor;
                    --tw-prose-quotes: currentColor;
                    --tw-prose-captions: currentColor;
                    --tw-prose-hr: currentColor;
                    color: inherit;
                  }
                  .preview-content strong, .preview-content b {
                    font-weight: 700 !important;
                  }
                  .preview-content {
                    font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif !important;
                    font-size: 12px !important;
                  }
                  .preview-content .prose * {
                    font-family: inherit;
                  }

                  .preview-content h2 { font-size: 1.875rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: inherit; }
                  .preview-content h3 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: inherit; }
                  .preview-content p { margin-bottom: 1.25rem; line-height: 1.75; color: inherit; }
                  .preview-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.25rem; }
                  .preview-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.25rem; }
                  .preview-content li { margin-bottom: 0.5rem; color: inherit; }
                  .preview-content img { border-radius: 1rem; margin-top: 2rem; margin-bottom: 2rem; max-width: 100%; height: auto; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
                  .preview-content blockquote { border-left: 4px solid #f97316; padding-left: 1rem; font-style: italic; margin-bottom: 1.25rem; color: #71717a; }
                  .preview-content table { width: 100%; border-collapse: collapse; margin-bottom: 1.25rem; border-radius: 0.5rem; overflow: hidden; border: 1px solid #e4e4e7; }
                  .preview-content th { background: #f4f4f5; padding: 0.75rem; text-align: left; font-weight: 700; border: 1px solid #e4e4e7; }
                  .preview-content td { padding: 0.75rem; border: 1px solid #e4e4e7; color: inherit; }
                  
                  /* Task List styling */
                  .preview-content ul[data-type="taskList"] { list-style: none; padding: 0; margin-left: 0; }
                  .preview-content ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.75rem; }
                  .preview-content ul[data-type="taskList"] input[type="checkbox"] { margin-top: 0.4rem; height: 1.1rem; width: 1.1rem; border-radius: 0.25rem; border-color: #d4d4d8; accent-color: #f97316; }
                `}</style>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PreviewModal;
