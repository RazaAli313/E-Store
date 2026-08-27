import { useMemo } from 'react';

import { PRODUCT_LIST_SELECT, PRODUCT_PAGE_SIZE } from '#/constants';
import { useGetCategoryProducts } from '#/data/products/queries/getCategoryProducts';
import { useGetProducts } from '#/data/products/queries/getProducts';
import { useSearchProducts } from '#/data/products/queries/searchProducts';
import type { UseProductsResult } from '#/types/products/api.types';
import { matchesTerm } from './helpers';
import { useProductListParams } from './useProductListParams';

export const useProducts = (): UseProductsResult => {
  const { q, category, page, setSearch, setCategory, goToPage, clearFilters } = useProductListParams();
  const hasSearch = Boolean(q.trim());
  const hasCategory = Boolean(category);
  const skip = (page - 1) * PRODUCT_PAGE_SIZE;

  const productsQuery = useGetProducts({
    params: { limit: PRODUCT_PAGE_SIZE, skip, select: PRODUCT_LIST_SELECT },
    options: { enabled: !hasCategory && !hasSearch },
  });
  const searchQuery = useSearchProducts({
    params: { q: q.trim(), limit: PRODUCT_PAGE_SIZE, skip, select: PRODUCT_LIST_SELECT },
    options: { enabled: !hasCategory && hasSearch },
  });
  const categoryQuery = useGetCategoryProducts({
    slug: category,
    options: { enabled: hasCategory },
  });

  const filteredCategoryProducts = useMemo(() => {
    const products = categoryQuery.data?.products ?? [];
    return hasSearch ? products.filter(product => matchesTerm(product, q)) : products;
  }, [categoryQuery.data?.products, hasSearch, q]);

  const activeQuery = hasCategory ? categoryQuery : hasSearch ? searchQuery : productsQuery;
  const products = hasCategory
    ? filteredCategoryProducts.slice(skip, skip + PRODUCT_PAGE_SIZE)
    : (activeQuery.data?.products ?? []);
  const total = hasCategory ? filteredCategoryProducts.length : (activeQuery.data?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / PRODUCT_PAGE_SIZE));

  return {
    products,
    total,
    totalPages,
    isLoading: activeQuery.isLoading,
    isFetching: activeQuery.isFetching,
    isError: activeQuery.isError,
    isEmpty: !activeQuery.isLoading && !activeQuery.isError && products.length === 0,
    refetch: () => {
      void activeQuery.refetch();
    },
    q,
    category,
    page,
    setSearch,
    setCategory,
    goToPage,
    clearFilters,
  };
};
