import React from 'react';
import type { PossiblePlace, UserLocation } from '../types';

interface MapSuggestionsProps {
  places: PossiblePlace[];
  onSelectPlace: (placeName: string) => void;
  center: UserLocation;
}

const MapSuggestions: React.FC<MapSuggestionsProps> = ({ places, onSelectPlace, center }) => {
  const mapSrc = `https://maps.google.com/maps?q=${center.latitude},${center.longitude}&z=12&output=embed`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Your search was too broad. Did you mean one of these?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Nearby Locations</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {places.map((place, index) => (
              <button
                key={`${place.name}-${index}`}
                onClick={() => onSelectPlace(place.name)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-blue-100 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Select ${place.name} at ${place.address}`}
              >
                <p className="font-semibold text-blue-800">{place.name}</p>
                <p className="text-sm text-gray-600">{place.address}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full h-80 md:h-96">
          <iframe
            title="Map of nearby locations"
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
            className="border-0 rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MapSuggestions;
