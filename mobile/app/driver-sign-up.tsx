import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Logo from "@/components/ui/logo";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Link, Stack, useRouter } from "expo-router";
import { AxiosError } from "axios";
import { api } from "@/config/axios";
const DriverSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.post("/driver/register", {
        email,
        password,
        firstName,
        lastName,
        username,
      });
      if (response.status !== 200) {
        setError(response.statusText || "An error occurred");
      }
      router.replace(`/driver-home?id=${response.data.driver._id}`);
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        setError(axiosError?.response?.statusText || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Stack.Screen name="driver-sign-in" options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-zinc-200">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              className="px-4 py-6"
              keyboardShouldPersistTaps="handled"
            >
              <View className="items-center mb-6 self-start">
                <Logo />
              </View>

              <View className="w-full mb-4">
                <Text className="text-2xl mb-2 max-w-[280px]">
                  Sign up as a driver to get started.
                </Text>
              </View>

              <View className="flex-row w-full gap-2 mb-2">
                <Input
                  placeholder="First Name"
                  onChangeText={setFirstName}
                  value={firstName}
                  type="name"
                  className="flex-1"
                />
                <Input
                  placeholder="Last Name"
                  onChangeText={setLastName}
                  value={lastName}
                  type="name"
                  className="flex-1"
                />
              </View>

              <Input
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
                type="username"
                className="mb-2"
              />
              <Input
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                type="emailAddress"
                className="mb-2"
              />
              <Input
                placeholder="Password"
                onChangeText={setPassword}
                value={password}
                type="password"
                secureTextEntry
                className="mb-4"
              />

              <View className="w-full">
                <Button
                  onPress={handleSubmit}
                  disabled={loading}
                  className="py-4"
                >
                  {loading ? (
                    <ActivityIndicator color={"#fff"} size={"small"} />
                  ) : (
                    <Text className="text-zinc-100">Sign Up</Text>
                  )}
                </Button>
              </View>
              <View className="mt-2">
                <Text className="text-zinc-900">
                  Already have an account?{" "}
                  <Link
                    href={"/driver-sign-in"}
                    className="text-zinc-900 font-bold underline"
                  >
                    Sign In
                  </Link>
                </Text>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default DriverSignUp;
