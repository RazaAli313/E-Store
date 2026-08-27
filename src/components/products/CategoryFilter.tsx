import type { ChangeEvent, JSX } from 'react';

import { useGetCategoryList } from '#/data/products/queries/getCategoryList';
import { formatCategory } from '#/hooks/products/helpers';

interface CategoryFilterProps {
  value: string;
  onCategoryChange: (value: string) => void;
}

const CategoryFilter = ({ value, onCategoryChange }: CategoryFilterProps): JSX.Element => {
  const { data: categories = [], isLoading, isError } = useGetCategoryList();
  const updateCategory = (event: ChangeEvent<HTMLSelectElement>) => onCategoryChange(event.target.value);

  return (
    <label className='flex items-center gap-2 text-sm font-semibold text-gray-800'>
      Category
      <select
        value={value}
        onChange={updateCategory}
        disabled={isLoading || isError}
        className='rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal text-gray-800 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 disabled:cursor-not-allowed disabled:opacity-60'
      >
        <option value=''>
          {isLoading ? 'Loading categories...' : isError ? 'Categories unavailable' : 'All categories'}
        </option>
        {categories.map(category => (
          <option key={category} value={category}>
            {formatCategory(category)}
          </option>
        ))}
      </select>
    </label>
  );
};

export default CategoryFilter;
