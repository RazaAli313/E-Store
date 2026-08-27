import type { JSX } from 'react';

import { useLocation } from 'react-router-dom';

import type { ProductListItem } from '#/types/products/product.types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: ProductListItem[];
}

const ProductGrid = ({ products }: ProductGridProps): JSX.Element => {
  const location = useLocation();

  return (
    <section aria-label='Products' className='grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {products.map(product => (
        <ProductCard key={product.id} product={product} listSearch={location.search} />
      ))}
    </section>
  );
};

export default ProductGrid;
