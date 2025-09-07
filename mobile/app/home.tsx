import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { GoogleMaps } from "expo-maps";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocationPermissions } from "@/hooks/useLocationPermissions";

const Home = () => {
  const {top} = useSafeAreaInsets()
  const { errorMsg, location } = useLocationPermissions();

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 pt-[${top}px]`}>
      <GoogleMaps.View
      style={StyleSheet.absoluteFill}
      cameraPosition={{
        coordinates: location
          ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }
          : {
              latitude: 0,
              longitude: 0,
            },
        zoom: 14,
      }}
      markers={[
        {
          coordinates: location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }
            : {
                latitude: 0,
                longitude: 0,
              },
        },
      ]}
    />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
