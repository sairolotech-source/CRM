import React, { useEffect } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";

type SkeletonProps = {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

const SkeletonBox = React.memo(function SkeletonBox({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const { isDark } = useTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => {
    const bgOpacity = interpolate(shimmer.value, [0, 1], [0.08, 0.18]);
    return { opacity: bgOpacity };
  });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: isDark ? "#fff" : "#0F172A",
        },
        animStyle,
        style,
      ]}
    />
  );
});

export function CardSkeleton() {
  const { colors } = useTheme();
  return (
    <View
      style={[
        skStyles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <SkeletonBox width={80} height={22} borderRadius={6} />
      <SkeletonBox width="70%" height={20} borderRadius={6} />
      <SkeletonBox width="50%" height={14} borderRadius={4} />
      <SkeletonBox width="100%" height={14} borderRadius={4} />
      <View style={skStyles.row}>
        <SkeletonBox width={80} height={26} borderRadius={8} />
        <SkeletonBox width={80} height={26} borderRadius={8} />
        <SkeletonBox width={80} height={26} borderRadius={8} />
      </View>
      <View style={skStyles.footer}>
        <SkeletonBox width={100} height={28} borderRadius={6} />
        <SkeletonBox width={90} height={36} borderRadius={10} />
      </View>
    </View>
  );
}

export function HomeSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={[skStyles.homeWrap, { backgroundColor: colors.background }]}>
      <View style={skStyles.headerSk}>
        <SkeletonBox width={100} height={14} borderRadius={4} />
        <SkeletonBox width={180} height={28} borderRadius={6} />
        <SkeletonBox width={220} height={14} borderRadius={4} />
      </View>
      <View style={skStyles.gridWrap}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View
            key={i}
            style={[skStyles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <SkeletonBox width={40} height={40} borderRadius={10} />
            <SkeletonBox width={60} height={14} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={skStyles.listWrap}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}

const skStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  homeWrap: {
    flex: 1,
    gap: 20,
  },
  headerSk: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 24,
    gap: 8,
  },
  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 20,
  },
  gridCard: {
    width: "30%",
    flexGrow: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    minWidth: 100,
  },
  listWrap: {
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
});

export default SkeletonBox;
