import { View, Text, Image } from "react-native";
import React from "react";
import { useRouter, Stack } from "expo-router";
import Logo from "@/components/ui/logo";
import Button from "@/components/ui/button";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const Main = () => {
  const router = useRouter();
  useEffect(() => {
    async function fetchToken() {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.push("/home");
      }
    }
    fetchToken();
  }, []);

  const handlePress = () => {
    router.push("/sign-in");
  };
  return (
    <>
      <Stack.Screen name="main" options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-zinc-200 p-4">
        <View className="flex-1 items-center justify-center mt-8">
          <Image
            source={require("../assets/images/get-started.png")}
            resizeMode="contain"
            style={{ flex: 1, width: "100%" }}
          />
        </View>
        <View>
          <Button onPress={handlePress} className="py-4">
            <Text className="text-zinc-100">Get Started</Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Main;
