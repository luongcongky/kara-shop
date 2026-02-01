import { useState, useMemo, useCallback } from 'react';
import { NextPageWithLayout } from './_app';
import { PrimaryLayout } from '@/layouts';
import { useCompare } from '@/context/CompareContext';
import { api } from '@/utils/api';
import Image from 'next/image';
import { BsCartPlus, BsTrash, BsCheckCircle } from 'react-icons/bs';
import Link from 'next/link';
import { numberWithCommas } from '@/utils';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';
import { Product } from '@/types';
import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

const ComparePage: NextPageWithLayout = () => {
  const { t } = useTranslation('compare');
  const { comparedProducts, removeFromCompare } = useCompare();
  const { addItem } = useCart();
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  const productIds = useMemo(() => comparedProducts.map(p => p.id), [comparedProducts]);

  const { data: products, isLoading } = api.product.getProductsByIds.useQuery(
    { ids: productIds },
    { enabled: productIds.length > 0 }
  );

  const productList = useMemo(() => {
     if (!products) return [];
     return products;
  }, [products]);

  const groupedAttributes = useMemo(() => {
    if (!productList) return {};
    const groups: Record<string, Set<string>> = {};
    const defaultGroup = t('table.default_spec_group');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    productList.forEach((p: any) => {
        if (p.attributes) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            p.attributes.forEach((a: any) => {
                const group = a.groupName || defaultGroup;
                if (!groups[group]) {
                    groups[group] = new Set();
                }
                groups[group].add(a.attributeName);
            });
        }
    });

    return groups;
  }, [productList, t]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAttributeValue = useCallback((product: any, attrName: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return product.attributes?.find((a: any) => a.attributeName === attrName)?.attributeValue || '-';
  }, []);

  const isDifferent = useCallback((attrName: string) => {
    if (!productList || productList.length < 2) return false;
    const firstVal = getAttributeValue(productList[0], attrName);
    return productList.some(p => getAttributeValue(p, attrName) !== firstVal);
  }, [productList, getAttributeValue]);

  const visibleGroups = useMemo(() => {
    const result: Record<string, string[]> = {};
    Object.entries(groupedAttributes).forEach(([groupName, attrs]) => {
        let attrList = Array.from(attrs);
        if (showDifferencesOnly) {
            attrList = attrList.filter(attr => isDifferent(attr));
        }
        if (attrList.length > 0) {
            result[groupName] = attrList;
        }
    });
    return result;
  }, [groupedAttributes, showDifferencesOnly, isDifferent]);

  if (productIds.length === 0) {
     return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
             <div className="mb-4 rounded-full bg-gray-100 p-6">
                 <BsCheckCircle size={48} className="text-gray-400" />
             </div>
             <h2 className="text-2xl font-bold text-gray-800">{t('empty_state.title')}</h2>
             <p className="mt-2 text-gray-500">{t('empty_state.description')}</p>
             <Link href="/" className="mt-6 rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
                 {t('empty_state.continue_shopping')}
             </Link>
        </div>
     );
  }

  if (isLoading) {
      return (
          <div className="flex h-screen items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
        <NextSeo title={t('meta_title')} />
        
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <div className="flex items-center gap-4">
                 <label className="flex cursor-pointer items-center gap-2 select-none">
                     <div className="relative">
                         <input 
                            type="checkbox" 
                            className="peer sr-only"
                            checked={showDifferencesOnly}
                            onChange={(e) => setShowDifferencesOnly(e.target.checked)}
                         />
                         <div className="h-6 w-11 rounded-full bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                     </div>
                     <span className="text-sm font-medium text-gray-700">{t('controls.show_differences_only')}</span>
                 </label>
            </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm text-gray-500">
                <thead className="bg-gray-50">
                    <tr>
                         <th className="sticky top-0 z-20 min-w-[200px] bg-gray-50 p-4 text-left font-semibold text-gray-900 shadow-sm">
                             {t('table.general_info')}
                         </th>
                         {productList?.map(product => (
                             <th key={product.id} className="sticky top-0 z-20 min-w-[250px] bg-gray-50 p-4 align-top shadow-sm">
                                 <div className="relative">
                                     <button 
                                        onClick={() => removeFromCompare(product.id)}
                                        className="absolute -right-2 -top-2 rounded-full bg-gray-200 p-1 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-500"
                                        title={t('actions.remove')}
                                     >
                                         <BsTrash size={14} />
                                     </button>
                                     <div className="aspect-square relative mb-3 w-full overflow-hidden rounded-lg bg-white">
                                         <Image 
                                             src={product.images[0]?.imageURL || '/camera-placeholder.png'} 
                                             alt={product.name}
                                             fill
                                             className="object-contain p-2"
                                         />
                                     </div>
                                     <Link href={`/product/${product.id}/slug`} className="hover:text-blue-600">
                                         <h3 className="line-clamp-2 text-sm font-bold text-gray-800 hover:underline">
                                             {product.name}
                                         </h3>
                                     </Link>
                                     <div className="mt-2 text-lg font-bold text-red-600">
                                         {numberWithCommas(product.price)}đ
                                     </div>
                                     <button 
                                         onClick={() => {
                                             addItem(product as unknown as Product);
                                             toast.success(t('actions.added_to_cart'));
                                         }}
                                         className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2 text-xs font-bold text-white transition-colors hover:bg-orange-600"
                                     >
                                         <BsCartPlus size={16} /> {t('actions.add_to_cart')}
                                     </button>
                                 </div>
                             </th>
                         ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {/* Basic Info Rows */}
                    {!showDifferencesOnly && (
                        <>
                             <tr>
                                 <td className="p-4 font-medium text-gray-900 bg-gray-50/50">{t('table.rating')}</td>
                                 {productList?.map(product => (
                                     <td key={product.id} className="p-4">
                                         <div className="flex items-center gap-1 text-yellow-500">
                                             <span className="font-bold text-gray-700">{product.rate}</span> / 5
                                         </div>
                                     </td>
                                 ))}
                             </tr>
                             <tr>
                                 <td className="p-4 font-medium text-gray-900 bg-gray-50/50">{t('table.colors')}</td>
                                 {productList?.map(product => (
                                     <td key={product.id} className="p-4">
                                         <div className="flex gap-1">
                                             {product.colors.map(c => (
                                                 <span key={c} className="rounded px-2 py-0.5 text-xs font-medium bg-gray-100 border border-gray-200 text-gray-600">
                                                     {c}
                                                 </span>
                                             ))}
                                         </div>
                                     </td>
                                 ))}
                             </tr>
                        </>
                    )}

                    {/* Dynamic Attributes Grouped */}
                    {Object.entries(visibleGroups).map(([groupName, attrs]) => (
                        <>
                            <tr key={`group-${groupName}`} className="bg-gray-100">
                                <td colSpan={productList && productList.length + 1} className="p-3 font-bold text-gray-800 uppercase text-xs tracking-wider">
                                    {groupName}
                                </td>
                            </tr>
                            {attrs.map(attrName => (
                                <tr key={attrName} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900 bg-gray-50/50 pl-6">{attrName}</td>
                                    {productList?.map(product => (
                                        <td key={product.id} className="p-4 text-gray-700">
                                            {getAttributeValue(product, attrName)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </>
                    ))}
                    
                    {/* Description (Always show unless diff only and they are same? Description is usually long and different) */}
                     {!showDifferencesOnly && (
                        <tr>
                             <td className="p-4 font-medium text-gray-900 bg-gray-50/50 align-top">{t('table.description')}</td>
                             {productList?.map(product => (
                                 <td key={product.id} className="p-4 align-top">
                                     <div 
                                        className="prose prose-sm max-w-none line-clamp-6 text-xs text-gray-500"
                                        dangerouslySetInnerHTML={{ __html: product.description }} 
                                     />
                                 </td>
                             ))}
                        </tr>
                     )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

ComparePage.getLayout = (page) => {
  return <PrimaryLayout seo={{ title: 'So sánh sản phẩm' }}>{page}</PrimaryLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'vi', ['common', 'compare', 'header', 'footer'])),
    },
  };
};

export default ComparePage;
