import React, { useState, useCallback, useEffect } from 'react';
import { fetchPlaceDetails, findPossiblePlaces } from './services/geminiService';
import type { PlaceData, PossiblePlace } from './types';
import { useGeolocation } from './hooks/useGeolocation';
import Header from './components/Header';
import PlaceInput from './components/PlaceInput';
import ResultsTable from './components/ResultsTable';
import ErrorAlert from './components/ErrorAlert';
import MapSuggestions from './components/MapSuggestions';

const CACHE_KEY = 'mapCodeFinderResults';

const App: React.FC = () => {
    const [results, setResults] = useState<PlaceData[]>(() => {
        try {
            const cachedData = localStorage.getItem(CACHE_KEY);
            return cachedData ? JSON.parse(cachedData) : [];
        } catch (error) {
            console.error("Failed to parse cached results:", error);
            return [];
        }
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [possiblePlaces, setPossiblePlaces] = useState<PossiblePlace[]>([]);
    const { location, error: geolocationError } = useGeolocation();

    useEffect(() => {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(results));
        } catch (error) {
            console.error("Failed to save results to cache:", error);
        }
    }, [results]);

    const handleSearch = useCallback(async (placeName: string) => {
        if (!location) {
            setError(geolocationError || "Could not get your location. Please enable location services and refresh the page.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setPossiblePlaces([]);

        try {
            const details = await fetchPlaceDetails(placeName, location);
            const newResult: PlaceData = {
                id: new Date().toISOString(),
                ...details
            };
            setResults(prevResults => [newResult, ...prevResults]);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            if (errorMessage.includes("Please try a more specific place name")) {
                try {
                    const candidates = await findPossiblePlaces(placeName, location);
                    if (candidates.length > 0) {
                        setPossiblePlaces(candidates);
                    } else {
                        setError("Could not find your place, and no alternatives were found. Please try a more specific name.");
                    }
                } catch (findError) {
                    setError(findError instanceof Error ? findError.message : "Could not find alternative places.");
                }
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, [location, geolocationError]);

    const handlePlaceSelect = useCallback((placeName: string) => {
        handleSearch(placeName);
    }, [handleSearch]);

    const handleClearResults = useCallback(() => {
        setResults([]);
    }, []);


    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header />
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="space-y-8">
                            <PlaceInput onSearch={handleSearch} isLoading={isLoading} />
                             {error && <ErrorAlert message={error} />}
                             {geolocationError && !location && <ErrorAlert message={geolocationError} />}
                             
                            {possiblePlaces.length > 0 && !isLoading && (
                                <MapSuggestions
                                    places={possiblePlaces}
                                    onSelectPlace={handlePlaceSelect}
                                    center={location!}
                                />
                            )}
                            
                            <ResultsTable results={results} onClearResults={handleClearResults} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
