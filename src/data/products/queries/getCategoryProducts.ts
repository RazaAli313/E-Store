import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import { apiEndpoints, GET, PRODUCT_CATEGORY_SELECT, queryKeys } from '#/constants';
import { performRequest } from '#/services/apiClient';
import type { UseGetCategoryProductsProps } from '#/types/products/api.types';
import type { ProductsResponse } from '#/types/products/product.types';

interface CategoryProductsQueryParams extends Record<string, unknown> {
  limit: number;
  select: string;
}

export const useGetCategoryProducts = ({
  slug,
  options = {},
}: UseGetCategoryProductsProps): UseQueryResult<ProductsResponse, Error> => {
  const params: CategoryProductsQueryParams = {
    limit: 0,
    select: PRODUCT_CATEGORY_SELECT,
  };

  return useQuery({
    queryKey: [queryKeys.PRODUCT_CATEGORY, slug],
    queryFn: async ({ signal }) => {
      try {
        return await performRequest<ProductsResponse, undefined, CategoryProductsQueryParams>({
          method: GET,
          url: apiEndpoints.productsByCategory(slug),
          params,
          config: { signal },
        });
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return { products: [], total: 0, skip: 0, limit: 0 };
        }
        throw error;
      }
    },
    enabled: Boolean(slug),
    ...options,
  });
};
