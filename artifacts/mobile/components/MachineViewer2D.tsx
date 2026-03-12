import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import Svg, {
  Rect,
  Line,
  Text as SvgText,
  G,
  Defs,
  Pattern,
  Circle,
  Path,
  Polygon,
} from "react-native-svg";
import {
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import AnimatedPressable from "@/components/AnimatedPressable";
import type { Part2D } from "@/hooks/useMachineVisualization";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIEWER_WIDTH = SCREEN_WIDTH - 40;
const VIEWER_HEIGHT = 340;
const SVG_WIDTH = 800;
const SVG_HEIGHT = 340;

const PART_COLORS: Record<string, string> = {
  "entry-gate": "#00D4FF",
  "main-base": "#00FF88",
  "roll-shaft": "#FFD700",
  "gear-drive": "#FF6B6B",
  "cutting-system": "#B388FF",
};

type Props = {
  parts: Part2D[];
  drawingUrls?: string[];
  machineName?: string;
  machineColor?: string;
};

function useZoomPanGestures() {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(0.5, Math.min(savedScale.value * e.scale, 4));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value < 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        scale.value = withSpring(2);
        savedScale.value = 2;
      }
    });

  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return { composedGesture, animatedStyle };
}

function ImageDrawingViewer({
  drawingUrls,
  parts,
  machineName,
}: {
  drawingUrls: string[];
  parts: Part2D[];
  machineName: string;
}) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeDrawingIndex, setActiveDrawingIndex] = useState(0);
  const { composedGesture, animatedStyle } = useZoomPanGestures();

  const currentUrl = drawingUrls[activeDrawingIndex];

  return (
    <View>
      {drawingUrls.length > 1 && (
        <View style={styles.drawingSelector}>
          {drawingUrls.map((_, idx) => (
            <AnimatedPressable
              key={idx}
              onPress={() => {
                setActiveDrawingIndex(idx);
                setImageLoaded(false);
                setImageError(false);
              }}
              scaleDown={0.95}
            >
              <View
                style={[
                  styles.drawingSelectorItem,
                  idx === activeDrawingIndex && styles.drawingSelectorItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.drawingSelectorText,
                    idx === activeDrawingIndex && styles.drawingSelectorTextActive,
                  ]}
                >
                  Drawing {idx + 1}
                </Text>
              </View>
            </AnimatedPressable>
          ))}
        </View>
      )}
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.imageViewerContainer, animatedStyle]}>
          {!imageError ? (
            <>
              <Image
                source={{ uri: currentUrl }}
                style={styles.drawingImage}
                resizeMode="contain"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {!imageLoaded && (
                <View style={styles.imageLoadingOverlay}>
                  <ActivityIndicator size="large" color="#00D4FF" />
                  <Text style={styles.loadingText}>Loading drawing...</Text>
                </View>
              )}
              {imageLoaded && (
                <View style={styles.annotationOverlay}>
                  <Svg width={VIEWER_WIDTH} height={VIEWER_HEIGHT} style={StyleSheet.absoluteFill}>
                    {parts.map((part) => {
                      const color = PART_COLORS[part.id] || "#00D4FF";
                      const isSelected = selectedPart === part.id;
                      const scaleX = VIEWER_WIDTH / SVG_WIDTH;
                      const scaleY = VIEWER_HEIGHT / SVG_HEIGHT;
                      return (
                        <G
                          key={part.id}
                          onPress={() => setSelectedPart(isSelected ? null : part.id)}
                        >
                          <Rect
                            x={part.x * scaleX}
                            y={part.y * scaleY}
                            width={part.width * scaleX}
                            height={part.height * scaleY}
                            fill={isSelected ? color : "transparent"}
                            fillOpacity={isSelected ? 0.2 : 0}
                            stroke={color}
                            strokeWidth={isSelected ? 2 : 1}
                            strokeDasharray={isSelected ? "0" : "6 3"}
                            rx="4"
                          />
                          <Rect
                            x={part.x * scaleX + (part.width * scaleX) / 2 - part.label.length * 3 - 4}
                            y={part.y * scaleY - 16}
                            width={part.label.length * 6 + 8}
                            height={14}
                            fill={isSelected ? color : "#0A1628"}
                            fillOpacity={isSelected ? 0.9 : 0.85}
                            stroke={color}
                            strokeWidth={0.5}
                            rx="3"
                          />
                          <SvgText
                            x={part.x * scaleX + (part.width * scaleX) / 2}
                            y={part.y * scaleY - 6}
                            fill={isSelected ? "#fff" : color}
                            fontSize="8"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            {part.label.toUpperCase()}
                          </SvgText>
                        </G>
                      );
                    })}
                  </Svg>
                </View>
              )}
            </>
          ) : (
            <View style={styles.imageErrorContainer}>
              <Text style={styles.imageErrorText}>Failed to load drawing</Text>
              <Text style={styles.imageErrorSubtext}>The technical drawing could not be loaded</Text>
            </View>
          )}
          <View style={styles.machineNameLabel}>
            <Text style={styles.machineNameText}>{machineName.toUpperCase()}</Text>
          </View>
        </Animated.View>
      </GestureDetector>
      <View style={styles.legend}>
        {parts.map((part) => {
          const color = PART_COLORS[part.id] || "#00D4FF";
          const isSelected = selectedPart === part.id;
          return (
            <AnimatedPressable
              key={part.id}
              onPress={() => setSelectedPart(isSelected ? null : part.id)}
              scaleDown={0.95}
            >
              <View
                style={[
                  styles.legendItem,
                  isSelected && { backgroundColor: color + "20", borderColor: color },
                ]}
              >
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={[styles.legendText, isSelected && { color }]}>
                  {part.label}
                </Text>
              </View>
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
}

function BlueprintViewer({
  parts,
  machineName,
}: {
  parts: Part2D[];
  machineName: string;
}) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const { composedGesture, animatedStyle } = useZoomPanGestures();

  return (
    <View>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.svgContainer, animatedStyle]}>
          <Svg width={VIEWER_WIDTH} height={VIEWER_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
            <Defs>
              <Pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <Line x1="20" y1="0" x2="20" y2="20" stroke="#1E3A5F" strokeWidth="0.5" />
                <Line x1="0" y1="20" x2="20" y2="20" stroke="#1E3A5F" strokeWidth="0.5" />
              </Pattern>
              <Pattern id="gridMajor" width="100" height="100" patternUnits="userSpaceOnUse">
                <Line x1="100" y1="0" x2="100" y2="100" stroke="#2A4A6F" strokeWidth="1" />
                <Line x1="0" y1="100" x2="100" y2="100" stroke="#2A4A6F" strokeWidth="1" />
              </Pattern>
            </Defs>

            <Rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} fill="#0A1628" />
            <Rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#grid)" />
            <Rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#gridMajor)" />

            <Rect x="2" y="2" width={SVG_WIDTH - 4} height={SVG_HEIGHT - 4} fill="none" stroke="#2A4A6F" strokeWidth="2" />
            <Rect x="6" y="6" width={SVG_WIDTH - 12} height={SVG_HEIGHT - 12} fill="none" stroke="#1E3A5F" strokeWidth="0.5" />

            <SvgText x="20" y="25" fill="#4A7A9F" fontSize="10" fontFamily="monospace">
              {machineName.toUpperCase()} — TECHNICAL DRAWING
            </SvgText>
            <SvgText x={SVG_WIDTH - 20} y="25" fill="#4A7A9F" fontSize="9" fontFamily="monospace" textAnchor="end">
              SCALE: 1:50
            </SvgText>

            <G>
              <Rect x="130" y="250" width="540" height="50" fill="none" stroke="#3A6A8F" strokeWidth="1.5" strokeDasharray="4 2" />
              <Line x1="50" y1="275" x2="130" y2="275" stroke="#3A6A8F" strokeWidth="1" />
              <Line x1="670" y1="275" x2="750" y2="275" stroke="#3A6A8F" strokeWidth="1" />

              <Rect x="60" y="140" width="70" height="110" fill="none" stroke="#3A6A8F" strokeWidth="1" rx="3" />
              <Line x1="95" y1="140" x2="95" y2="250" stroke="#3A6A8F" strokeWidth="0.5" strokeDasharray="3 2" />
              <Circle cx="80" cy="180" r="8" fill="none" stroke="#3A6A8F" strokeWidth="1" />
              <Circle cx="80" cy="220" r="8" fill="none" stroke="#3A6A8F" strokeWidth="1" />
              <Polygon points="60,250 130,250 125,240 65,240" fill="none" stroke="#3A6A8F" strokeWidth="0.8" />

              <G>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <G key={`roller-${i}`}>
                    <Circle cx={200 + i * 35} cy="170" r="12" fill="none" stroke="#3A6A8F" strokeWidth="1" />
                    <Circle cx={200 + i * 35} cy="170" r="4" fill="none" stroke="#3A6A8F" strokeWidth="0.5" />
                    <Circle cx={200 + i * 35} cy="210" r="12" fill="none" stroke="#3A6A8F" strokeWidth="1" />
                    <Circle cx={200 + i * 35} cy="210" r="4" fill="none" stroke="#3A6A8F" strokeWidth="0.5" />
                    <Line x1={200 + i * 35} y1="158" x2={200 + i * 35} y2="222" stroke="#3A6A8F" strokeWidth="0.5" strokeDasharray="2 2" />
                  </G>
                ))}
                <Rect x="180" y="155" width="230" height="70" fill="none" stroke="#3A6A8F" strokeWidth="1" rx="2" />
                <Line x1="180" y1="190" x2="410" y2="190" stroke="#00FF88" strokeWidth="0.8" strokeDasharray="6 3" />
              </G>

              <G>
                <Rect x="440" y="130" width="110" height="120" fill="none" stroke="#3A6A8F" strokeWidth="1" rx="2" />
                <Circle cx="475" cy="170" r="20" fill="none" stroke="#3A6A8F" strokeWidth="1" />
                <Circle cx="475" cy="170" r="5" fill="none" stroke="#3A6A8F" strokeWidth="0.5" />
                <Circle cx="520" cy="200" r="15" fill="none" stroke="#3A6A8F" strokeWidth="1" />
                <Circle cx="520" cy="200" r="4" fill="none" stroke="#3A6A8F" strokeWidth="0.5" />
                <Line x1="488" y1="157" x2="510" y2="190" stroke="#3A6A8F" strokeWidth="0.8" />
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <Line
                    key={`gear-tooth-${i}`}
                    x1={475 + 22 * Math.cos((i * Math.PI) / 4)}
                    y1={170 + 22 * Math.sin((i * Math.PI) / 4)}
                    x2={475 + 26 * Math.cos((i * Math.PI) / 4)}
                    y2={170 + 26 * Math.sin((i * Math.PI) / 4)}
                    stroke="#3A6A8F"
                    strokeWidth="2"
                  />
                ))}
              </G>

              <G>
                <Rect x="600" y="130" width="80" height="120" fill="none" stroke="#3A6A8F" strokeWidth="1" rx="2" />
                <Line x1="620" y1="130" x2="620" y2="250" stroke="#FF6B6B" strokeWidth="1" strokeDasharray="4 3" />
                <Line x1="660" y1="130" x2="660" y2="250" stroke="#FF6B6B" strokeWidth="1" strokeDasharray="4 3" />
                <Path d="M 630 150 L 650 150 L 650 230 L 630 230 Z" fill="none" stroke="#3A6A8F" strokeWidth="1" />
                <Path d="M 635 170 L 645 160 L 645 180 Z" fill="#FF6B6B" fillOpacity="0.3" stroke="#FF6B6B" strokeWidth="0.5" />
              </G>

              <Line x1="60" y1="190" x2="680" y2="190" stroke="#00D4FF" strokeWidth="0.5" strokeDasharray="8 4" opacity="0.4" />
            </G>

            {parts.map((part) => {
              const color = PART_COLORS[part.id] || "#00D4FF";
              const isSelected = selectedPart === part.id;
              return (
                <G
                  key={part.id}
                  onPress={() => setSelectedPart(isSelected ? null : part.id)}
                >
                  <Rect
                    x={part.x}
                    y={part.y}
                    width={part.width}
                    height={part.height}
                    fill={isSelected ? color : "transparent"}
                    fillOpacity={isSelected ? 0.15 : 0}
                    stroke={color}
                    strokeWidth={isSelected ? 2 : 1}
                    strokeDasharray={isSelected ? "0" : "6 3"}
                    rx="4"
                  />
                </G>
              );
            })}

            {parts.map((part) => {
              const color = PART_COLORS[part.id] || "#00D4FF";
              const isSelected = selectedPart === part.id;
              const labelX = part.x + part.width / 2;
              const labelY = part.y - 8;
              return (
                <G key={`label-${part.id}`}>
                  <Rect
                    x={labelX - part.label.length * 3.5 - 6}
                    y={labelY - 10}
                    width={part.label.length * 7 + 12}
                    height={14}
                    fill={isSelected ? color : "#0A1628"}
                    fillOpacity={isSelected ? 0.9 : 0.85}
                    stroke={color}
                    strokeWidth={isSelected ? 1.5 : 0.5}
                    rx="3"
                  />
                  <SvgText
                    x={labelX}
                    y={labelY}
                    fill={isSelected ? "#fff" : color}
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {part.label.toUpperCase()}
                  </SvgText>
                </G>
              );
            })}

            <SvgText x="20" y={SVG_HEIGHT - 12} fill="#4A7A9F" fontSize="8" fontFamily="monospace">
              MATERIAL: HARDENED STEEL {"\u2022"} TOLERANCE: {"\u00B1"}0.05mm
            </SvgText>
            <SvgText x={SVG_WIDTH - 20} y={SVG_HEIGHT - 12} fill="#4A7A9F" fontSize="8" fontFamily="monospace" textAnchor="end">
              DWG-001 REV.A
            </SvgText>
          </Svg>
        </Animated.View>
      </GestureDetector>

      <View style={styles.legend}>
        {parts.map((part) => {
          const color = PART_COLORS[part.id] || "#00D4FF";
          const isSelected = selectedPart === part.id;
          return (
            <AnimatedPressable
              key={part.id}
              onPress={() => setSelectedPart(isSelected ? null : part.id)}
              scaleDown={0.95}
            >
              <View
                style={[
                  styles.legendItem,
                  isSelected && { backgroundColor: color + "20", borderColor: color },
                ]}
              >
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={[styles.legendText, isSelected && { color }]}>
                  {part.label}
                </Text>
              </View>
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
}

export default function MachineViewer2D({
  parts,
  drawingUrls = [],
  machineName = "Roll Forming Machine",
}: Props) {
  const hasApiDrawings = drawingUrls.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Technical Drawing</Text>
        <Text style={styles.subtitle}>Pinch to zoom {"\u2022"} Double-tap to reset</Text>
      </View>
      {hasApiDrawings ? (
        <ImageDrawingViewer
          drawingUrls={drawingUrls}
          parts={parts}
          machineName={machineName}
        />
      ) : (
        <BlueprintViewer parts={parts} machineName={machineName} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E2E8F0",
    fontFamily: "Inter_600SemiBold",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontFamily: "Inter_400Regular",
  },
  svgContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#0A1628",
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  imageViewerContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#0A1628",
    borderWidth: 1,
    borderColor: "#1E3A5F",
    width: VIEWER_WIDTH,
    height: VIEWER_HEIGHT,
    position: "relative",
  },
  drawingImage: {
    width: VIEWER_WIDTH,
    height: VIEWER_HEIGHT,
  },
  imageLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 22, 40, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#64748B",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  annotationOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  imageErrorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imageErrorText: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  imageErrorSubtext: {
    color: "#64748B",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  drawingSelector: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  drawingSelectorItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#1E293B",
  },
  drawingSelectorItemActive: {
    borderColor: "#00D4FF",
    backgroundColor: "#00D4FF18",
  },
  drawingSelectorText: {
    fontSize: 12,
    color: "#94A3B8",
    fontFamily: "Inter_500Medium",
  },
  drawingSelectorTextActive: {
    color: "#00D4FF",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#1E293B",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: "#94A3B8",
    fontFamily: "Inter_500Medium",
  },
  machineNameLabel: {
    position: "absolute",
    bottom: 4,
    left: 8,
  },
  machineNameText: {
    fontSize: 8,
    color: "#4A7A9F",
    fontFamily: "monospace",
  },
});
