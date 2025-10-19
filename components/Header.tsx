
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                    Map Code & Phone Finder
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Enter a place name to find its phone number and Japan Mapcode automatically.
                </p>
            </div>
        </header>
    );
};

export default Header;
