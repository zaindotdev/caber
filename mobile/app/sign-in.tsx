import {
  ScrollView,
  View,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import Logo from "@/components/ui/logo";
import Button from "@/components/ui/button";
import Toast from "@/components/ui/toast";
import { api } from "@/config/axios";
import { Link, Redirect, Stack, useRouter } from "expo-router";
import Input from "@/components/ui/input";
import type { ResponseType } from "@/utils/types";
import { AxiosError } from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/utils/cn";

const { height } = Dimensions.get("screen");

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseType | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    if (otp.length === 0) {
      setOpen(false);
    }
  }, [otp]);

  const fetchToken = useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      router.replace("/home");
    }
  }, [router]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      if (email.trim() === "") {
        setResponse({ status: "error", message: "Email is required" });
        setIsToastVisible(true);
        return;
      }
      const { data } = await api.post("/user/sign-in", { email });
      if (data.status === 200) {
        setOpen(true);
        setResponse({ status: "success", message: "OTP sent to your email" });
        setIsToastVisible(true);
      }
    } catch (error) {
      console.error("Sign-in error:", {
        message: (error as Error).message,
        isAxiosError: (error as any).isAxiosError,
        config: (error as any)?.config,
        request: (error as any)?.request,
        response: (error as any)?.response, // includes status, headers, data
      });
      if(error instanceof AxiosError){
        setResponse({ status: "error", message: error.response?.data.message });
      }
      setIsToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      if (otp.trim() === "") {
        setResponse({ status: "error", message: "OTP is required" });
        setIsToastVisible(true);
        return;
      }
      const { data: response } = await api.post("/user/verify", { email, otp });

      if (response.status === 200 && response.data.token) {
        try {
          await AsyncStorage.setItem(
            "token",
            JSON.stringify(response.data.token)
          );
        } catch (storageError) {
          console.error("Storage Error:", storageError);
        }

        setResponse({ status: "success", message: "Sign-in successful!" });
        setIsToastVisible(true);

        try {
          await router.replace("/");
        } catch (routerError) {
          console.error("Navigation error:", routerError);
          router.push("/");
        }
      } else {
        console.error("Invalid response data:", response.data);
        setResponse({ status: "error", message: "No token received" });
        setIsToastVisible(true);
      }
    } catch (error) {
      console.error(error);
      setResponse({
        status: "error",
        message:
          (error as AxiosError)?.response?.data &&
          typeof (error as AxiosError).response?.data === "object"
            ? ((error as AxiosError).response?.data as { message?: string })
                .message || "An error occurred"
            : "An error occurred",
      });
      setIsToastVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={top + 10}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingTop: top }}
            keyboardShouldPersistTaps="handled"
            className="flex-1 bg-zinc-200"
          >
            <View className="flex-1 p-4 relative">
              {response && (
                <Toast
                  message={response.message}
                  status={response.status}
                  isVisible={isToastVisible}
                />
              )}
              <View
                style={{ height: height - 240 }}
                className={cn(
                  "rounded-3xl bg-zinc-100 my-4 shadow-lg overflow-hidden relative"
                )}
              >
                <View className="p-4">
                  <Logo />
                  <View>
                    <Text className="text-xl font-bold mt-2">
                      Sign in to your account
                    </Text>
                  </View>
                </View>
                <View className="w-full h-full absolute top-0 left-0 z-[-1]">
                  <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    source={require("../assets/images/sign-in.png")}
                    className="w-full h-full"
                  />
                </View>
              </View>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
              />
              <Input
                value={otp}
                onChangeText={setOtp}
                placeholder="OTP"
                keyboardType="numeric"
                className={cn("mt-4", open ? "block" : "hidden")}
              />
              <Button
                onPress={open ? handleOtpSubmit : handleSignIn}
                disabled={loading}
                className="py-4"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-zinc-100">
                    {open ? "Sign In" : "Continue"}
                  </Text>
                )}
              </Button>
              <View className="mt-2">
                <Text className="text-zinc-800 text-center">
                  <Link href="/driver-sign-in">Sign In as a Driver?</Link>
                </Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignIn;
