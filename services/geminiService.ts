import { GoogleGenAI } from "@google/genai";
import type { UserLocation, PossiblePlace } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface PlaceInfo {
    phoneNumber: string;
    address: string;
}

/**
 * Fetches phone number and address for a place using Google Maps grounding.
 */
async function getPlaceInfo(placeName: string, location: UserLocation): Promise<PlaceInfo> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find the official phone number and full address for "${placeName}". Respond in the format:\nPhoneNumber: [The phone number]\nAddress: [The full address]`,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: location.latitude,
                            longitude: location.longitude
                        }
                    }
                }
            },
        });

        const responseText = response.text.trim();
        
        const phoneRegex = /PhoneNumber:\s*(.*)/;
        const addressRegex = /Address:\s*(.*)/;
        
        const phoneMatch = responseText.match(phoneRegex);
        const addressMatch = responseText.match(addressRegex);
        
        const phoneNumber = phoneMatch ? phoneMatch[1].trim() : null;
        const address = addressMatch ? addressMatch[1].trim() : null;
        
        if (phoneNumber && address) {
            return { phoneNumber, address };
        } else {
            throw new Error("Phone number or address not found in response.");
        }

    } catch (error) {
        console.error("Error fetching place info from Gemini:", error);
        throw new Error("Could not retrieve the place's phone number and address. Please try a more specific place name.");
    }
}

/**
 * Fetches the Japan Mapcode for a given address.
 */
async function getMapCode(address: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `What is the Japan Mapcode for the address: "${address}"? Respond with only the numerical map code, for example: "123 456 789*10".`,
        });

        const mapCode = response.text.trim();
        if (mapCode && mapCode.match(/[\d\s\*]+/)) {
            return mapCode;
        } else {
            return "Not Found";
        }

    } catch (error) {
        console.error("Error fetching map code from Gemini:", error);
        throw new Error("Could not retrieve the Mapcode.");
    }
}

export const fetchPlaceDetails = async (placeName: string, location: UserLocation) => {
    const { phoneNumber, address } = await getPlaceInfo(placeName, location);
    const mapCode = await getMapCode(address);
    return {
        placeName,
        phoneNumber,
        address,
        mapCode
    };
};

/**
 * Finds a list of possible places when a search query is ambiguous.
 */
export async function findPossiblePlaces(placeName: string, location: UserLocation): Promise<PossiblePlace[]> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find up to 5 possible places that match "${placeName}". For each place, respond with each on a new line in the format:\nName: [name] | Address: [address] | Latitude: [latitude] | Longitude: [longitude]`,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: location.latitude,
                            longitude: location.longitude
                        }
                    }
                }
            },
        });

        const responseText = response.text.trim();
        const places: PossiblePlace[] = [];
        const lines = responseText.split('\n');

        for (const line of lines) {
            if (!line.includes('|')) continue;

            const nameMatch = line.match(/Name:\s*(.*?)\s*\|/);
            const addressMatch = line.match(/Address:\s*(.*?)\s*\|/);
            const latMatch = line.match(/Latitude:\s*(-?[\d.]+)/);
            const lonMatch = line.match(/Longitude:\s*(-?[\d.]+)/);

            if (nameMatch && addressMatch && latMatch && lonMatch) {
                const name = nameMatch[1].trim();
                const address = addressMatch[1].trim();
                const latitude = parseFloat(latMatch[1]);
                const longitude = parseFloat(lonMatch[1]);

                if (name && address && !isNaN(latitude) && !isNaN(longitude)) {
                     places.push({ name, address, latitude, longitude });
                }
            }
        }
        
        return places;

    } catch (error) {
        console.error("Error finding possible places from Gemini:", error);
        throw new Error("Could not find alternative places. Please try again.");
    }
}