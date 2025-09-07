import { Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const DriverHome = () => {
  return (
    <>
      <Stack.Screen name="driver-home" options={{ headerShown: false }} />
      <View>
        <Text>DriverHome</Text>
      </View>
    </>
  );
};

export default DriverHome;
