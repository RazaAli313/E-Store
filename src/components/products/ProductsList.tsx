import type { JSX } from 'react';
import { useEffect } from 'react';

import { toast } from 'react-toastify';

import { formatCategory } from '#/hooks/products/helpers';
import { useProducts } from '#/hooks/products/useProducts';
import CategoryFilter from './CategoryFilter';
import Pagination from './Pagination';
import ProductGrid from './ProductGrid';
import SearchBar from './SearchBar';
import Spinner from './Spinner';
import StateMessage from './StateMessage';
import StoreHeader from './StoreHeader';

const ProductsList = (): JSX.Element => {
  const {
    products,
    total,
    totalPages,
    isLoading,
    isFetching,
    isError,
    isEmpty,
    refetch,
    q,
    category,
    page,
    setSearch,
    setCategory,
    goToPage,
    clearFilters,
  } = useProducts();

  useEffect(() => {
    if (isError) toast.error('Products could not be loaded.');
  }, [isError]);

  const countLabel = `${total} product${total === 1 ? '' : 's'}${category ? ` in ${formatCategory(category)}` : ''}${
    q.trim() ? ` for “${q.trim()}”` : ''
  }`;

  return (
    <div className='min-h-screen bg-[#f5f6fb] text-gray-900'>
      <StoreHeader>
        <SearchBar value={q} onSearch={setSearch} />
      </StoreHeader>
      <main className='mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8'>
        <h1 className='sr-only'>Discover products</h1>
        <div className='mb-5 flex flex-wrap items-center gap-3'>
          <CategoryFilter value={category} onCategoryChange={setCategory} />
          <p className='ml-auto text-sm font-medium text-gray-500' aria-live='polite'>
            {isFetching && !isLoading ? 'Updating… ' : ''}
            {countLabel}
          </p>
        </div>

        {isLoading && <Spinner />}
        {isError && (
          <StateMessage
            variant='error'
            title='Products are unavailable'
            description='Check your connection and try loading the catalog again.'
            actionLabel='Try again'
            onAction={refetch}
          />
        )}
        {isEmpty && (
          <StateMessage
            title='No products match'
            description={
              q || category
                ? 'Try a different search or category, or clear the active filters.'
                : 'No products are available right now.'
            }
            actionLabel={q || category ? 'Clear filters' : undefined}
            onAction={q || category ? clearFilters : undefined}
          />
        )}
        {!isLoading && !isError && !isEmpty && (
          <>
            <ProductGrid products={products} />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </main>
    </div>
  );
};

export default ProductsList;
