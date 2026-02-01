import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'next-i18next';

export interface ComparedProduct {
  id: number;
  name: string;
  imageURL: string;
  category?: string; // Changed to string to support CollectionType enum
  price: number;
  slug?: string;
}

interface CompareContextType {
  comparedProducts: ComparedProduct[];
  addToCompare: (product: ComparedProduct) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation('compare');
  const [comparedProducts, setComparedProducts] = useLocalStorage<ComparedProduct[]>('kara-compare-list', []);
  const [isOpen, setIsOpen] = useState(false);

  // Auto-open bar when products exist
  useEffect(() => {
    if (comparedProducts && comparedProducts.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [comparedProducts]);

  const addToCompare = (product: ComparedProduct) => {
    setComparedProducts((prev) => {
      const currentList = prev || [];
      
      // Check if already exists
      if (currentList.some((p) => p.id === product.id)) {
        toast.error(t('errors.already_in_list', 'Sản phẩm đã có trong danh sách so sánh'));
        return currentList;
      }

      // Check max limit
      if (currentList.length >= 4) {
        toast.error(t('errors.limit_reached', 'Chỉ được so sánh tối đa 4 sản phẩm'));
        return currentList;
      }

      // Check category consistency
      if (currentList.length > 0 && product.category) {
         const firstProduct = currentList[0];
         if (firstProduct.category && firstProduct.category !== product.category) {
             toast.error(t('errors.cannot_compare_different_categories', { 
                 cat1: product.category, 
                 cat2: firstProduct.category,
                 defaultValue: `Không thể so sánh '${product.category}' với '${firstProduct.category}'. Hãy xóa danh sách cũ trước.`
             }));
             return currentList;
         }
      }

      toast.success(t('actions.added_to_compare', 'Đã thêm vào so sánh'));
      return [...currentList, product];
    });
  };

  const removeFromCompare = (id: number) => {
    setComparedProducts((prev) => (prev || []).filter((p) => p.id !== id));
  };

  const clearCompare = () => {
    setComparedProducts([]);
  };

  return (
    <CompareContext.Provider
      value={{
        comparedProducts: comparedProducts || [],
        addToCompare,
        removeFromCompare,
        clearCompare,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
