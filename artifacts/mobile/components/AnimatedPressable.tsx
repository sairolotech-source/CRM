import React, { useCallback } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

const SPRING_CONFIG = { damping: 15, stiffness: 400, mass: 0.5 };

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scaleDown?: number;
  haptic?: boolean;
  disabled?: boolean;
};

const AnimatedPressable = React.memo(function AnimatedPressable({
  children,
  onPress,
  style,
  scaleDown = 0.97,
  haptic = true,
  disabled = false,
}: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const firePress = useCallback(() => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  }, [onPress, haptic]);

  const gesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      scale.value = withSpring(scaleDown, SPRING_CONFIG);
      opacity.value = withSpring(0.85, SPRING_CONFIG);
    })
    .onFinalize((_, success) => {
      scale.value = withSpring(1, SPRING_CONFIG);
      opacity.value = withSpring(1, SPRING_CONFIG);
      if (success) {
        runOnJS(firePress)();
      }
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, animStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
});

export default AnimatedPressable;
