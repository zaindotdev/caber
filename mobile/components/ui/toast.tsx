import React, { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

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
  const translateY = useSharedValue(-100);

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
          -100,
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
      translateY.value = -100;
    }
  }, [isVisible, duration, onHide, translateY]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[animatedStyle]}
      className={`absolute z-50 top-5 left-5 right-5 ${status === "success" ? "bg-green-500/60" : "bg-red-500/60"} p-2 rounded-lg items-start`}
    >
      <Text className="text-white text-base font-medium">{message}</Text>
    </Animated.View>
  );
};

export default Toast;
