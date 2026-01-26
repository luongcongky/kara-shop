import { Product } from '@/types';
import { ProductItem, Skeleton } from './ProductItem';
import { FiSearch } from 'react-icons/fi';

interface Props {
  products: Product[] | undefined;
  isLoading: boolean;
  currentSlug?: string;
}

export const ProductsList = ({ products, isLoading, currentSlug }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {isLoading &&
        Array(12)
          .fill('')
          .map((_, index) => <Skeleton key={index} />)}
      {products && products.length > 0 ? (
        products.map(product => (
          <div key={product.id}>
            <ProductItem {...product} currentSlug={currentSlug} />
          </div>
        ))
      ) : (
        !isLoading && products && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-50 shadow-inner">
               <FiSearch className="text-4xl text-neutral-300" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-neutral-800">Không tìm thấy sản phẩm nào</h3>
            <p className="max-w-md text-sm font-medium text-neutral-400">
                Rất tiếc, chúng tôi không tìm thấy sản phẩm nào khớp với tiêu chí của bạn. 
                Vui lòng thử thay đổi bộ lọc hoặc chọn chuyên mục khác.
            </p>
          </div>
        )
      )}
    </div>
  );
};
