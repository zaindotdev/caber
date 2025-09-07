import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Stack, Link, useLocalSearchParams } from "expo-router";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import api from "@/config/axios";

const DriverOtpVerification = () => {
    const { id } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const onVerify = useCallback(async () => {
    if (!id) {
      Alert.alert("Error", "Missing verification id.");
      return;
    }

    if (otp.length < 6) {
      Alert.alert("Invalid code", "Please enter the 6-digit code.");
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const res = await api.post(`/driver/verify?id=${encodeURIComponent(String(id))}`, { otp });
      setLoading(false);

      // success feedback - adjust navigation as needed
      Alert.alert("Success", res?.data?.message || "Phone verified.");
    } catch (err: any) {
      setLoading(false);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to verify code. Please try again.";
      Alert.alert("Verification failed", message);
    }
  }, [id, otp]);

  const onResend = () => {
    // TODO: implement resend using api if available
  };

  return (
    <>
      <Stack.Screen name="driver-otp" options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-zinc-200">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              className="px-4 py-6"
              keyboardShouldPersistTaps="handled"
            >
              <View className="items-center mb-6 self-start">
                <Logo />
              </View>

              <View className="w-full mb-4">
                <Text className="text-2xl mb-2 max-w-[280px]">
                  Enter verification code
                </Text>
                <Text className="text-sm text-zinc-600">
                  Please enter the 6-digit code sent to your phone.
                </Text>
              </View>

              <Input
                placeholder="Enter OTP"
                value={otp}
                onChangeText={(text: string) => setOtp(text.replace(/\D/g, ""))}
                keyboardType="number-pad"
                maxLength={6}
                className="mb-4 text-lg"
              />

              <View className="w-full">
                <Button disabled={loading || otp.length < 6} className="py-4" onPress={onVerify}>
                  {loading ? (
                    <ActivityIndicator color={"#fff"} size={"small"} />
                  ) : (
                    <Text className="text-zinc-100">Verify</Text>
                  )}
                </Button>
              </View>

              <View className="mt-4 items-center">
                <Text className="text-zinc-700">
                  Didn't receive a code?{" "}
                  <Text onPress={onResend} className="font-bold underline text-zinc-900">
                    Resend
                  </Text>
                </Text>
                <View className="mt-2">
                  <Text className="text-zinc-700">
                    Wrong number?{" "}
                    <Link href="/driver-sign-in" className="font-bold underline text-zinc-900">
                      Go back
                    </Link>
                  </Text>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default DriverOtpVerification