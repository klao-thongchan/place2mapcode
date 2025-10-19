
import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PlaceInputProps {
  onSearch: (placeName: string) => void;
  isLoading: boolean;
}

const PlaceInput: React.FC<PlaceInputProps> = ({ onSearch, isLoading }) => {
  const [placeName, setPlaceName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (placeName.trim() && !isLoading) {
      onSearch(placeName.trim());
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Enter a place name (e.g., Tokyo Tower)"
                className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !placeName.trim()}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
                {isLoading ? <LoadingSpinner /> : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                )}
                Search
            </button>
        </form>
    </div>
  );
};

export default PlaceInput;
