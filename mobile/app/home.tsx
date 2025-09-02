import { View, Dimensions, Text } from "react-native";
import React, { useState } from "react";
import Input from "@/components/ui/input";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { useAnimatedGestureHandler } from "react-native-reanimated";

const { height } = Dimensions.get("screen");
const MIN_HEIGHT = height / 6;
const MAX_HEIGHT = height / 2;
const springConfig = {
  damping: 20,
  stiffness: 90,
  mass: 0.5,
};

const Home = () => {
  const [destination, setDestination] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const animationHeight = useSharedValue(MIN_HEIGHT);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animationHeight.value,
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startHeight = animationHeight.value;
    },
    onActive: (event, context: any) => {
      const newHeight = context.startHeight - event.translationY;
      animationHeight.value = Math.max(
        MIN_HEIGHT,
        Math.min(newHeight, MAX_HEIGHT)
      );
    },
    onEnd: (event) => {
      const shouldExpand =
        event.velocityY < 0 ||
        animationHeight.value > (MIN_HEIGHT + MAX_HEIGHT) / 2;
      animationHeight.value = withSpring(
        shouldExpand ? MAX_HEIGHT : MIN_HEIGHT,
        {
          velocity: event.velocityY,
        }
      );
      runOnJS(setIsExpanded)(shouldExpand);
    },
  });

  const handleInputFocus = () => {
    animationHeight.value = withSpring(MAX_HEIGHT, springConfig);
    setIsExpanded(true);
  };

  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-zinc-200 relative">
        <View className="bg-red-500 flex-1 items-center justify-center">
          <Text>Map</Text>
        </View>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            className="w-full bg-zinc-300 absolute bottom-0 left-0 rounded-t-3xl"
            style={animatedStyle}
          >
            <Animated.View className="w-24 h-[3px] bg-zinc-400 absolute top-4 left-1/2 -translate-x-1/2 rounded-full" />
            <View className="p-4 mt-4">
              <Text className="text-2xl font-bold mb-2">
                Choose your destination
              </Text>
              <Input
                className="mb-4"
                type="addressCityAndState"
                keyboardType="default"
                placeholder="Destination"
                onChangeText={setDestination}
                value={destination}
                onPressIn={handleInputFocus}
              />
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
};

export default Home;
