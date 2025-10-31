import React, { useState } from 'react';
import type { PlaceData } from '../types';

interface ResultsTableProps {
  results: PlaceData[];
  onClearResults: () => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results, onClearResults }) => {
    const [copySuccess, setCopySuccess] = useState('');
    const [isConfirmingClear, setIsConfirmingClear] = useState(false);
    const [copiedRowId, setCopiedRowId] = useState<string | null>(null);

    const copyToClipboard = () => {
        if (results.length === 0) return;

        const tsvContent = results
            .map(r => `${r.placeName}\t${r.mapCode}\t${r.phoneNumber}\t${r.address}`)
            .join('\n');

        navigator.clipboard.writeText(tsvContent).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy.');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    const copyRowToClipboard = (row: PlaceData) => {
        const tsvContent = `${row.placeName}\t${row.mapCode}\t${row.phoneNumber}\t${row.address}`;
        navigator.clipboard.writeText(tsvContent).then(() => {
            setCopiedRowId(row.id);
            setTimeout(() => setCopiedRowId(null), 2000);
        }, () => {
            // You could add failure feedback here if desired
        });
    };

    const handleClear = () => {
        onClearResults();
        setIsConfirmingClear(false);
    }
    
    if (results.length === 0) {
        return (
            <div className="text-center py-10 px-6 bg-white rounded-lg shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No results yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start a new search to see your results here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Results</h2>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={copyToClipboard}
                            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                            Copy for Sheet
                        </button>
                        {copySuccess && <span className="absolute -top-8 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2">{copySuccess}</span>}
                    </div>
                     <div>
                        {isConfirmingClear ? (
                             <div className="flex items-center gap-2">
                                <button onClick={handleClear} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200">
                                    Confirm
                                </button>
                                <button onClick={() => setIsConfirmingClear(false)} className="px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-200">
                                    Cancel
                                </button>
                             </div>
                        ) : (
                             <button
                                onClick={() => setIsConfirmingClear(true)}
                                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Clear Results
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">The Japan Mapcode is generated based on the address found and its accuracy may vary. Results are formatted for direct pasting into Google Sheets or Excel.</p>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Map Code</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telephone</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {results.map((result) => (
                            <tr key={result.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.placeName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{result.mapCode}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.phoneNumber}</td>
                                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline hover:text-blue-800 transition duration-150 ease-in-out"
                                        aria-label={`View ${result.placeName} on Google Maps`}
                                    >
                                        {result.address}
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <button
                                        onClick={() => copyRowToClipboard(result)}
                                        className="text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md p-1 transition-colors duration-200"
                                        aria-label={`Copy row for ${result.placeName}`}
                                    >
                                        {copiedRowId === result.id ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultsTable;