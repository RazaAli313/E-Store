import type { UseQueryResult } from '@tanstack/react-query';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { apiEndpoints, GET, queryKeys } from '#/constants';
import { performRequest } from '#/services/apiClient';
import type { ProductsQueryParams, UseGetProductsProps } from '#/types/products/api.types';
import type { ProductsResponse } from '#/types/products/product.types';

export const useGetProducts = ({
  params,
  options = {},
}: UseGetProductsProps): UseQueryResult<ProductsResponse, Error> => {
  return useQuery({
    queryKey: [queryKeys.PRODUCTS, params],
    queryFn: ({ signal }) =>
      performRequest<ProductsResponse, undefined, ProductsQueryParams>({
        method: GET,
        url: apiEndpoints.PRODUCTS,
        params,
        config: { signal },
      }),
    placeholderData: keepPreviousData,
    ...options,
  });
};
