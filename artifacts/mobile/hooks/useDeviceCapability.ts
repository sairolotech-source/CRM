import { useState, useEffect } from "react";
import { Platform } from "react-native";

export type DeviceCapability = {
  supports3D: boolean;
  isLowEnd: boolean;
  checked: boolean;
};

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>({
    supports3D: true,
    isLowEnd: false,
    checked: false,
  });

  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl2") || canvas.getContext("webgl");
        if (!gl) {
          setCapability({ supports3D: false, isLowEnd: true, checked: true });
          return;
        }
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        let isLow = false;
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          const lowEndKeywords = ["swiftshader", "llvmpipe", "software"];
          isLow = lowEndKeywords.some((k) =>
            renderer.toLowerCase().includes(k)
          );
        }
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        if (maxTextureSize < 4096) {
          isLow = true;
        }
        setCapability({ supports3D: true, isLowEnd: isLow, checked: true });
      } catch {
        setCapability({ supports3D: false, isLowEnd: true, checked: true });
      }
    } else {
      setCapability({ supports3D: false, isLowEnd: false, checked: true });
    }
  }, []);

  return capability;
}
