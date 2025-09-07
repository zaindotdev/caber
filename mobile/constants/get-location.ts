import axios, { AxiosError } from "axios";

export const getLocations = async (query: string) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${process.env.EXPO_PUBLIC_MAPS_API}`;
    const response = await axios.get(url);
    if (response.status !== 200) {
      console.error(response.data);
      return null;
    }
    return response.data;
  } catch (error) {
    console.error(JSON.stringify(error));
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
  }
};

export const getDistanceMatrix = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&mode=driving&key=${process.env.EXPO_PUBLIC_MAPS_API}`;

    const res = await axios.get(url);
    // console.log(JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    console.error("Distance Matrix Error:", JSON.stringify(error));
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
  }
};

export const getPlaceDetails = async (placeId: string) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry/location,formatted_address&key=${process.env.EXPO_PUBLIC_MAPS_API}`;
    const res = await axios.get(url);
    // console.warn(JSON.stringify(res.data));
    return res.data.result;
  } catch (error) {
    console.error(JSON.stringify(error));
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
  }
};

export const getDirections = async (
  origin: { latitude: number; longitude: number },
  destination: { lat: number; lng: number }
) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.lat},${destination.lng}&mode=driving&key=${process.env.EXPO_PUBLIC_MAPS_API}`;

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("Directions API error:", error);
    return null;
  }
};
