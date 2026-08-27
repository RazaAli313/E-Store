import type { JSX } from 'react';

interface SpinnerProps {
  label?: string;
}

const Spinner = ({ label = 'Loading products...' }: SpinnerProps): JSX.Element => {
  return (
    <div role='status' className='grid min-h-[44vh] place-items-center text-center'>
      <div>
        <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600' />
        <p className='mt-4 text-sm font-medium text-gray-500'>{label}</p>
      </div>
    </div>
  );
};

export default Spinner;
