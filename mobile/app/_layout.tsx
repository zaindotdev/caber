import { Stack } from "expo-router";
import React from "react";
import "../global.css";
import { StatusBar } from "react-native";

const RootLayout = () => {
  return (
    <>
      <StatusBar className="bg-zinc-200" barStyle="dark-content" />
      <Stack initialRouteName="index">
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default RootLayout;
