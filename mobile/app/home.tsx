import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GoogleMaps } from "expo-maps";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useLocationPermissions } from "@/hooks/useLocationPermissions";
import Toast from "@/components/ui/toast";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import Input from "@/components/ui/input";
import {
  getDistanceMatrix,
  getLocations,
  getPlaceDetails,
  getDirections,
} from "@/constants/get-location";
import { decodePolyline } from "@/constants/decode-polyline";
import Button from "@/components/ui/button";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.7;
const MIN_TRANSLATE_Y = -120;

interface Location {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface DistanceMatrix {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: {
    elements: {
      distance: { text: string; value: number };
      duration: { text: string; value: number };
    }[];
  }[];
}

const Home = () => {
  const { errorMsg, location } = useLocationPermissions();
  const insets = useSafeAreaInsets();

  const [destinationSearch, setDestinationSearch] = useState("");
  const [suggestedLocations, setSuggestedLocations] = useState<any[]>([]);
  const [destination, setDestination] = useState<Location | null>(null);
  const [distanceMatrix, setDistanceMatrix] = useState<DistanceMatrix | null>(
    null
  );
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const translateY = useSharedValue(MIN_TRANSLATE_Y);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.y = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = Math.max(
        MAX_TRANSLATE_Y,
        Math.min(MIN_TRANSLATE_Y, context.y + event.translationY)
      );
    },
    onEnd: () => {
      const shouldSnapToTop =
        translateY.value < (MAX_TRANSLATE_Y + MIN_TRANSLATE_Y) / 2;
      translateY.value = shouldSnapToTop ? MAX_TRANSLATE_Y : MIN_TRANSLATE_Y;
    },
  });

  const rBottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const rBackdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y, MIN_TRANSLATE_Y],
      [0.5, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const rContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y, MAX_TRANSLATE_Y * 0.8],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const markers = useMemo(() => {
    const markersList: any[] = [];

    if (location?.coords?.latitude && location?.coords?.longitude) {
      markersList.push({
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        title: "Your Location",
        color: "#3B82F6",
      });
    }

    if (destination?.geometry?.location) {
      markersList.push({
        coordinates: {
          latitude: destination.geometry.location.lat,
          longitude: destination.geometry.location.lng,
        },
        title: destination.formatted_address,
        color: "#EF4444",
      });
    }

    return markersList;
  }, [location, destination]);

  // Fixed polylines configuration
  const polylines = useMemo(() => {
    if (routeCoords.length === 0) return [];
    
    
    return [
      {
        coordinates: routeCoords,
        color: "#2563eb", // Blue color
        width: 4,
        geodesic: true, // Add geodesic property for better route rendering
      },
    ];
  }, [routeCoords]);

  const cameraPosition = useMemo(() => {
    if (!location?.coords?.latitude || !location?.coords?.longitude) {
      return { coordinates: { latitude: 0, longitude: 0 }, zoom: 14 };
    }

    if (destination?.geometry?.location) {
      const centerLat =
        (location.coords.latitude + destination.geometry.location.lat) / 2;
      const centerLng =
        (location.coords.longitude + destination.geometry.location.lng) / 2;

      const latDiff = Math.abs(
        location.coords.latitude - destination.geometry.location.lat
      );
      const lngDiff = Math.abs(
        location.coords.longitude - destination.geometry.location.lng
      );
      const maxDiff = Math.max(latDiff, lngDiff);

      let zoom = 14;
      if (maxDiff > 0.1) zoom = 10;
      else if (maxDiff > 0.05) zoom = 11;
      else if (maxDiff > 0.01) zoom = 13;

      return {
        coordinates: { latitude: centerLat, longitude: centerLng },
        zoom,
      };
    }

    return {
      coordinates: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      zoom: 14,
    };
  }, [location, destination]);

  const handleDestinationSelect = useCallback(
    async (selectedLocation: any) => {
      try {
        const details = await getPlaceDetails(selectedLocation.place_id);
        setDestination(details);

        if (location?.coords && details?.geometry?.location) {
          const dist = await getDistanceMatrix(
            {
              lat: location.coords.latitude!,
              lng: location.coords.longitude!,
            },
            details.geometry.location
          );
          setDistanceMatrix(dist);

          const directions = await getDirections(
            {
              latitude: location.coords.latitude!,
              longitude: location.coords.longitude!,
            },
            details.geometry.location
          );


          if (directions.routes && directions.routes.length > 0) {
            const polyline = directions.routes[0].overview_polyline.points;
            const decodedRoute = decodePolyline(polyline);
            setRouteCoords(decodedRoute);
          } else {
            setRouteCoords([]);
          }
        }

        setDestinationSearch("");
        setSuggestedLocations([]);
        translateY.value = MIN_TRANSLATE_Y;
        Keyboard.dismiss();
      } catch (error) {
        console.error("Error getting destination:", error);
        setRouteCoords([]);
      }
    },
    [location]
  );

  useEffect(() => {
    if (!destinationSearch.trim()) {
      setSuggestedLocations([]);
      return;
    }
    getLocations(destinationSearch)
      .then((res) => setSuggestedLocations(res.predictions || []))
      .catch(() => setSuggestedLocations([]));
  }, [destinationSearch]);

  if (errorMsg) {
    return <Toast message={errorMsg} isVisible status="error" />;
  }

  if (!location?.coords?.latitude || !location?.coords?.longitude) {
    return (
      <View className="flex-1 justify-center items-center bg-zinc-100">
        <Text className="text-lg text-zinc-600">Loading your location...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <GoogleMaps.View
        style={{ position: "absolute", inset: 0 }}
        cameraPosition={cameraPosition}
        markers={markers}
        polylines={polylines}
      />

      <Animated.View
        className="absolute inset-0 bg-black"
        style={rBackdropStyle}
        pointerEvents="none"
      />

      {distanceMatrix && (
        <View className="absolute top-16 left-4 right-4 bg-white rounded-xl p-4 shadow-lg z-10">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-zinc-900 mb-2">
                Route Information
              </Text>
              
              <View className="mb-3">
                <Text className="text-sm font-medium text-zinc-600 mb-1">From:</Text>
                {distanceMatrix.origin_addresses.map((address, i) => (
                  <Text
                    className="text-sm text-zinc-800 bg-zinc-100 rounded-lg p-2 mb-1"
                    key={i}
                    numberOfLines={2}
                  >
                    {address}
                  </Text>
                ))}
              </View>

              <View className="mb-3">
                <Text className="text-sm font-medium text-zinc-600 mb-1">To:</Text>
                {distanceMatrix.destination_addresses.map((address, i) => (
                  <Text
                    className="text-sm text-zinc-800 bg-zinc-100 rounded-lg p-2 mb-1"
                    key={i}
                    numberOfLines={2}
                  >
                    {address}
                  </Text>
                ))}
              </View>

              <View className="flex-row items-center">
                <View className="bg-green-100 rounded-lg px-3 py-1 mr-2">
                  <Text className="text-sm font-semibold text-green-700">
                    {distanceMatrix.rows[0].elements[0].distance.text}
                  </Text>
                </View>
                <View className="bg-blue-100 rounded-lg px-3 py-1">
                  <Text className="text-sm font-semibold text-blue-700">
                    {distanceMatrix.rows[0].elements[0].duration.text}
                  </Text>
                </View>
              </View>
              
              {routeCoords.length > 0 && (
                <Text className="text-xs text-green-600 mt-2">
                  Route displayed on map ({routeCoords.length} points)
                </Text>
              )}
            </View>
            
            <TouchableOpacity
              onPress={() => {
                setDestination(null);
                setDistanceMatrix(null);
                setRouteCoords([]);
              }}
              className="ml-3 p-2 bg-zinc-100 rounded-full"
            >
              <AntDesign name="close" size={18} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Sheet */}
      <SafeAreaView className="flex-1" pointerEvents="box-none">
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            className="absolute w-full bg-white rounded-t-2xl shadow-lg border-t border-zinc-200"
            style={[
              {
                height: SCREEN_HEIGHT,
                top: SCREEN_HEIGHT,
                paddingBottom: insets.bottom,
              },
              rBottomSheetStyle,
            ]}
          >
            <View className="w-12 h-1 bg-zinc-300 rounded-full self-center mt-3 mb-4" />
            
            <View className="px-5 pb-4">
              <Text className="text-2xl font-bold text-zinc-900 mb-2">
                Where to?
              </Text>
              
              {destination && distanceMatrix ? (
                <View className="mb-4">
                  <Text className="text-base text-zinc-600 mb-3">
                    Ready to book your ride
                  </Text>
                  <Button
                    onPress={() =>
                      console.info(
                        "Finding driver for:",
                        destination.formatted_address
                      )
                    }
                  >
                    <Text className="text-lg text-white font-semibold text-center">
                      Find Driver
                    </Text>
                  </Button>
                </View>
              ) : (
                <Text className="text-base text-zinc-600 mb-4">
                  Drag up to search for your destination
                </Text>
              )}
            </View>

            <Animated.View className="flex-1 px-5" style={rContentStyle}>
              <View className="mb-6">
                <Input
                  placeholder="Search destination..."
                  value={destinationSearch}
                  onChangeText={setDestinationSearch}
                />
              </View>

              <View className="flex-1">
                <Text className="text-lg font-semibold text-zinc-700 mb-4">
                  {suggestedLocations.length > 0
                    ? "Search Results"
                    : "Suggested Locations"}
                </Text>
                
                {suggestedLocations.length > 0 ? (
                  <View className="flex-1">
                    {suggestedLocations.map((loc, i) => (
                      <TouchableOpacity
                        key={`${loc.place_id}-${i}`}
                        onPress={() => handleDestinationSelect(loc)}
                        className="flex-row items-center py-4 px-3 rounded-xl mb-2 bg-zinc-50 border border-zinc-200 active:bg-zinc-100"
                      >
                        <View className="w-10 h-10 rounded-full bg-blue-500 justify-center items-center mr-3">
                          <AntDesign name="enviromento" size={16} color="white" />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-base text-zinc-800 font-medium mb-1"
                            numberOfLines={1}
                          >
                            {loc.structured_formatting?.main_text ||
                              loc.description}
                          </Text>
                          <Text
                            className="text-sm text-zinc-500"
                            numberOfLines={2}
                          >
                            {loc.structured_formatting?.secondary_text || ""}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View className="flex-1 justify-center items-center py-12">
                    <AntDesign name="search1" size={48} color="#a1a1aa" />
                    <Text className="text-center text-zinc-500 mt-4 px-8 leading-6">
                      {destinationSearch.trim()
                        ? "No locations found for your search"
                        : "Start typing to search for destinations"}
                    </Text>
                  </View>
                )}
              </View>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;