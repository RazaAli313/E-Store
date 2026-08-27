import type { ChangeEvent, JSX } from 'react';
import { useEffect, useState } from 'react';

import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onSearch: (value: string) => void;
}

const SearchBar = ({ value, onSearch }: SearchBarProps): JSX.Element => {
  const [draftValue, setDraftValue] = useState(value);
  const updateSearchTerm = (event: ChangeEvent<HTMLInputElement>) => setDraftValue(event.target.value);

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  useEffect(() => {
    if (draftValue === value) return undefined;
    const timeoutId = window.setTimeout(() => onSearch(draftValue), 300);
    return () => window.clearTimeout(timeoutId);
  }, [draftValue, onSearch, value]);

  return (
    <label className='relative min-w-56 flex-1'>
      <span className='sr-only'>Search products</span>
      <Search
        aria-hidden='true'
        className='pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400'
      />
      <input
        type='search'
        value={draftValue}
        onChange={updateSearchTerm}
        placeholder='Search products...'
        autoComplete='off'
        className='w-full rounded-xl border border-gray-200 bg-[#fbfbfe] py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50'
      />
    </label>
  );
};

export default SearchBar;
