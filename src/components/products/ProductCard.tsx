import type { JSX } from 'react';

import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import { productDetailPath } from '#/constants';
import { formatPrice, getOriginalPrice, getSafeImageUrl, getStockPresentation } from '#/hooks/products/helpers';
import type { ProductListItem } from '#/types/products/product.types';

interface ProductCardProps {
  product: ProductListItem;
  listSearch: string;
}

const stockToneClasses = {
  available: 'bg-emerald-50 text-emerald-700',
  low: 'bg-amber-50 text-amber-700',
  out: 'bg-red-50 text-red-700',
};

const ProductCard = ({ product, listSearch }: ProductCardProps): JSX.Element => {
  const originalPrice = getOriginalPrice(product.price, product.discountPercentage);
  const stock = getStockPresentation(product.stock);
  const imageUrl = getSafeImageUrl(product.thumbnail);

  return (
    <Link
      to={productDetailPath(product.id)}
      state={{ listSearch }}
      className='group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2'
    >
      <article className='h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-xl group-focus-visible:-translate-y-1'>
        <div className='relative aspect-[4/3] overflow-hidden bg-gray-100'>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              className='h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]'
            />
          ) : (
            <div className='grid h-full place-items-center text-sm text-gray-500'>Image unavailable</div>
          )}
          {(product.discountPercentage ?? 0) > 0 && (
            <span className='absolute left-3 top-3 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm'>
              -{Math.round(product.discountPercentage ?? 0)}%
            </span>
          )}
        </div>
        <div className='p-4'>
          <h2 className='truncate text-[15px] font-bold text-gray-900'>{product.title}</h2>
          <p className='mt-0.5 h-5 text-sm text-gray-500'>
            {product.brand ?? formatCategoryFallback(product.category)}
          </p>
          <div className='mt-3 flex items-baseline gap-2'>
            <span className='text-lg font-extrabold text-gray-950'>{formatPrice(product.price)}</span>
            {originalPrice !== null && (
              <span className='text-sm text-gray-500 line-through'>{formatPrice(originalPrice)}</span>
            )}
          </div>
          <div className='mt-3 flex items-center justify-between gap-3'>
            <span className='flex items-center gap-1 text-sm font-semibold text-gray-800'>
              <span className='flex text-amber-500' aria-hidden='true'>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} className={`h-4 w-4 ${index < Math.round(product.rating) ? 'fill-current' : ''}`} />
                ))}
              </span>
              <span>{product.rating.toFixed(1)}</span>
              <span className='sr-only'>out of 5 stars</span>
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${stockToneClasses[stock.tone]}`}>
              {stock.label}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

const formatCategoryFallback = (category: string): string => category.replaceAll('-', ' ');

export default ProductCard;
