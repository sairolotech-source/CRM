import { Platform, ViewStyle } from "react-native";

export const shadow3D = (
  elevation: number = 8,
  color: string = "#000",
  opacity: number = 0.15
): ViewStyle =>
  Platform.OS === "web"
    ? {
        boxShadow: [
          `0px ${elevation * 0.5}px ${elevation * 1.2}px rgba(0,0,0,${opacity})`,
          `0px ${elevation * 0.15}px ${elevation * 0.4}px rgba(0,0,0,${opacity * 0.6})`,
          `0px 0px ${elevation * 0.3}px rgba(0,0,0,${opacity * 0.3})`,
        ].join(", "),
      }
    : {
        shadowColor: color,
        shadowOffset: { width: 0, height: elevation * 0.5 },
        shadowOpacity: opacity,
        shadowRadius: elevation * 1.2,
        elevation: elevation,
      };

export const shadowGlow = (color: string, size: number = 12): ViewStyle =>
  Platform.OS === "web"
    ? { boxShadow: `0px 4px ${size}px ${color}40, 0px 0px ${size * 2}px ${color}20` }
    : {
        shadowColor: color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: size,
        elevation: 8,
      };

export const shadowInset = (): ViewStyle =>
  Platform.OS === "web"
    ? { boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.06), inset 0px -1px 2px rgba(255,255,255,0.1)" }
    : {};

export const CARD_SHADOW = shadow3D(10, "#000", 0.12);
export const CARD_SHADOW_LG = shadow3D(16, "#000", 0.15);
export const CARD_SHADOW_XL = shadow3D(24, "#000", 0.18);
export const BUTTON_SHADOW = shadow3D(6, "#000", 0.2);
export const ICON_SHADOW = shadow3D(4, "#000", 0.1);
