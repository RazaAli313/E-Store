import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { apiEndpoints, GET, queryKeys } from '#/constants';
import { performRequest } from '#/services/apiClient';
import type { CategoryList } from '#/types/products/product.types';

export const useGetCategoryList = (): UseQueryResult<CategoryList, Error> => {
  return useQuery({
    queryKey: [queryKeys.PRODUCT_CATEGORY_LIST],
    queryFn: ({ signal }) =>
      performRequest<CategoryList>({
        method: GET,
        url: apiEndpoints.PRODUCTS_CATEGORY_LIST,
        config: { signal },
      }),
    staleTime: 1000 * 60 * 60,
  });
};
