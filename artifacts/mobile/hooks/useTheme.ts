import { useMemo } from "react";
import { Platform, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

export function useTheme() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const isDark = colorScheme === "dark";
    const colors = isDark ? Colors.dark : Colors.light;
    const topInset = Platform.OS === "web" ? 67 : insets.top;
    const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;
    const isWeb = Platform.OS === "web";
    const isIOS = Platform.OS === "ios";

    return { isDark, colors, topInset, bottomInset, isWeb, isIOS, insets };
  }, [colorScheme, insets.top, insets.bottom]);
}
