import { useSearchParams } from 'react-router-dom';

const getPageFromParams = (value: string | null): number => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

export const useProductListParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const page = getPageFromParams(searchParams.get('page'));

  const updateParam = (key: 'q' | 'category', value: string, replace = false) => {
    setSearchParams(
      currentParams => {
        const nextParams = new URLSearchParams(currentParams);
        const normalizedValue = value.trim();
        if (normalizedValue) nextParams.set(key, value);
        else nextParams.delete(key);
        nextParams.delete('page');
        return nextParams;
      },
      { replace }
    );
  };

  const setSearch = (value: string) => updateParam('q', value, true);
  const setCategory = (value: string) => updateParam('category', value);

  const goToPage = (nextPage: number) => {
    setSearchParams(currentParams => {
      const nextParams = new URLSearchParams(currentParams);
      if (nextPage <= 1) nextParams.delete('page');
      else nextParams.set('page', String(nextPage));
      return nextParams;
    });
  };

  const clearFilters = () => setSearchParams({});

  return { q, category, page, setSearch, setCategory, goToPage, clearFilters };
};
