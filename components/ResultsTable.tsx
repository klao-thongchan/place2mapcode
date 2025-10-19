
import React from 'react';
import type { PlaceData } from '../types';

interface ResultsTableProps {
  results: PlaceData[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
    const [copySuccess, setCopySuccess] = React.useState('');

    const copyToClipboard = () => {
        if (results.length === 0) return;

        const tsvContent = results
            .map(r => `${r.placeName}\t${r.phoneNumber}\t${r.mapCode}\t${r.address}`)
            .join('\n');

        navigator.clipboard.writeText(tsvContent).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy.');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };
    
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
            </div>
            <p className="text-sm text-gray-500 mb-4">The Japan Mapcode is generated based on the address found and its accuracy may vary. Results are formatted for direct pasting into Google Sheets or Excel.</p>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telephone</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Map Code</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {results.map((result) => (
                            <tr key={result.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.placeName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.phoneNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{result.mapCode}</td>
                                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{result.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultsTable;
