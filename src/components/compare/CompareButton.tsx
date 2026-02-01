import React from 'react';
import { BsArrowRepeat, BsCheck } from 'react-icons/bs';
import { useCompare, ComparedProduct } from '@/context/CompareContext';
import clsx from 'clsx';

interface CompareButtonProps {
  product: ComparedProduct;
  className?: string;
}

export const CompareButton: React.FC<CompareButtonProps> = ({ product, className }) => {
  const { comparedProducts, addToCompare, removeFromCompare } = useCompare();
  
  const isCompared = comparedProducts.some((p) => p.id === product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all duration-200",
        isCompared
          ? "bg-blue-600 text-white hover:bg-red-500"
          : "bg-white text-zinc-800 hover:bg-orange-500 hover:text-white",
        className
      )}
      title={isCompared ? "Xóa khỏi so sánh" : "Thêm vào so sánh"}
    >
      {isCompared ? <BsCheck size={18} /> : <BsArrowRepeat size={18} />}
    </button>
  );
};
