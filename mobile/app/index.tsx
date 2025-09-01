import { View, Text, Image } from "react-native";
import React from "react";
import { Link, useRouter, Stack } from "expo-router";
import Logo from "@/components/ui/logo";
import Button from "@/components/ui/button";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  return (
    <>
      <Stack.Screen name="main" options={{ headerShown: false }} />
      <View className="flex-1 bg-zinc-200 p-4">
        <Logo />
        <View className="flex-1 items-center justify-center mt-8">
          <Image
            source={require("../assets/images/get-started.jpg")}
            resizeMode="cover"
            style={{ flex: 1, width: "100%" }}
          />
        </View>
        <View>
          <Button className="py-4">
            <Link href="/sign-in">
              <Text className="text-zinc-100">Get Started</Text>
            </Link>
          </Button>
        </View>
      </View>
    </>
  );
};

export default Main;
