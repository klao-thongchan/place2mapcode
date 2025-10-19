export interface PlaceData {
  id: string;
  placeName: string;
  phoneNumber: string;
  mapCode: string;
  address: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface PossiblePlace {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}
