import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsX, BsArrowRight } from 'react-icons/bs';
import { useCompare } from '@/context/CompareContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'next-i18next';

export const CompareBar = () => {
  const { t } = useTranslation('compare');
  const { comparedProducts, removeFromCompare, clearCompare, isOpen } = useCompare();

  if (comparedProducts.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 z-[100] w-full bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t border-gray-100"
        >
          <div className="container mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-6">
              <span className="hidden text-sm font-medium text-gray-500 md:block">
                {t('bar.compare_count', { count: comparedProducts.length })}
              </span>
              
              <div className="flex gap-4">
                {comparedProducts.map((product) => (
                  <div key={product.id} className="relative group">
                    <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                      <Image
                        src={product.imageURL || '/camera-placeholder.png'}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {/* Fixed button positioning and z-index */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCompare(product.id);
                      }}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:bg-red-600 hover:scale-110 z-10"
                      title={t('actions.remove')}
                    >
                      <BsX size={16} />
                    </button>
                    
                    {/* Tooltip */}
                    <div className="absolute top-full left-0 mt-2 w-32 truncate rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 pointer-events-none z-20">
                        {product.name}
                    </div>
                  </div>
                ))}
                
                {Array.from({ length: 4 - comparedProducts.length }).map((_, idx) => (
                  <div
                    key={`placeholder-${idx}`}
                    className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-center"
                  >
                    <span className="text-[10px] text-gray-400 font-medium">{t('bar.empty_slot')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.preventDefault(); 
                  clearCompare();
                }}
                className="text-sm font-medium text-gray-500 underline decoration-gray-300 transition-colors hover:text-red-500 hover:decoration-red-500"
              >
                {t('controls.clear_all')}
              </button>
              <Link
                href="/compare"
                className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-blue-300 active:scale-95"
              >
                {t('controls.compare_now')} <BsArrowRight />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
