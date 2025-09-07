import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { Link, Stack } from 'expo-router'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import Logo from '@/components/ui/logo'

const DriverSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
                  Sign in as a driver to get started.
                </Text>
              </View>

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
                className="mb-4"
              />

              <View className="w-full">
                <Button disabled={loading} className="py-4">
                  {loading ? (
                    <ActivityIndicator color={"#fff"} size={"small"} />
                  ) : (
                    <Text className="text-zinc-100">Sign In</Text>
                  )}
                </Button>
              </View>
              <View className='mt-2'>
                <Text className="text-zinc-900">
                  Don't have an account?{" "}
                  <Link href={"/driver-sign-up"} className="text-zinc-900 font-bold underline">
                    Sign up
                  </Link>
                </Text>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  )
}

export default DriverSignIn

const styles = StyleSheet.create({})