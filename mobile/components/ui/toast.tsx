import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";

interface ToastProps {
  message: string;
  isVisible: boolean;
  duration?: number;
  status?: "success" | "error";
  onHide?: () => void;
}

const Toast = ({
  message,
  isVisible,
  duration = 3000,
  status,
  onHide,
}: ToastProps) => {
  const translateY = useSharedValue(-140);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (isVisible) {
      translateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });

      const timeout = setTimeout(() => {
        translateY.value = withTiming(
          -140,
          {
            duration: 400,
            easing: Easing.in(Easing.ease),
          },
          () => {
            if (onHide) onHide();
          }
        );
      }, duration);

      return () => clearTimeout(timeout);
    } else {
      translateY.value = -140;
    }
  }, [isVisible, duration, onHide, translateY]);

  if (!isVisible) return null;

  const handlePress = () => {
    translateY.value = withTiming(
      -140,
      {
        duration: 400,
        easing: Easing.in(Easing.ease),
      },
      () => {
        if (onHide) onHide();
      }
    );
  };

  return (
    <Animated.View
      style={[animatedStyle]}
      className={`absolute z-50 top-5 left-5 right-5 flex-row items-center justify-between gap-2 ${status === "success" ? "bg-green-500" : "bg-red-500"} py-1 px-2 rounded-lg items-start`}
    >
      <Text className="text-white text-base font-medium">{message}</Text>
      <TouchableOpacity
        onPress={handlePress}
        className="bg-red-400 p-2 rounded-full"
      >
        <AntDesign name="close" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Toast;
