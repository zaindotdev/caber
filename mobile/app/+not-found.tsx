import { View, Text } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";

const NotFound = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <View className="space-y-4 flex items-center justify-center">
          <Text className="text-4xl text-zinc-50 font-bold italic">404</Text>
          <Text className="text-2xl text-zinc-50">Page not found</Text>
        </View>
        <Link
          href={"/"}
          className="text-zinc-900 p-2 text-lg mt-4 bg-zinc-100 rounded-2xl border-2 border-zinc-900 ring-2 ring-zinc-100"
        >
          Back to Home
        </Link>
      </View>
    </>
  );
};

export default NotFound;
