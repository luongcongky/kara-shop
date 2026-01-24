import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { Accordion } from '@/components/ui';
import { useQuery } from '@/hooks';

export const ProductDescription = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { desc = '' } = router.query;
  const { addQuery, removeQuery } = useQuery({ shallow: true, scroll: true });
  const [inputValue, setInputValue] = useState(desc as string);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      addQuery('desc', inputValue.trim());
    } else {
      removeQuery('desc');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="rounded-lg bg-neutral-100">
      <Accordion open>
        <Accordion.Header className="flex w-full items-center justify-between px-2.5 py-2.5 text-sm font-semibold text-neutral-600">
          {t('filters.desc')}
        </Accordion.Header>
        <Accordion.Body>
          <div className="px-2.5 pb-2.5">
            <div className="relative flex items-center">
              <input
                type="text"
                className="h-full w-full rounded-lg border border-solid border-neutral-300 bg-white p-2.5 pr-9 text-sm text-neutral-900 placeholder-neutral-500 outline-none transition-colors focus:border-violet-500"
                placeholder="..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSubmit}
                className="absolute right-0 h-full w-[30px] cursor-pointer pr-2.5 text-neutral-500 hover:text-violet-700"
              >
                <FiArrowRight size="1.25rem" />
              </button>
            </div>
          </div>
        </Accordion.Body>
      </Accordion>
    </div>
  );
};
