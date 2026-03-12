import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import type {
  Mesh,
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  MeshStandardMaterial,
} from "three";
import AnimatedPressable from "@/components/AnimatedPressable";
import { Feather } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIEWER_WIDTH = SCREEN_WIDTH - 40;
const VIEWER_HEIGHT = 380;

type MachinePart = {
  name: string;
  color: number;
  position: [number, number, number];
};

const MACHINE_PARTS: MachinePart[] = [
  { name: "Entry Gate", color: 0x00d4ff, position: [-3.5, 0.8, 0] },
  { name: "Main Base", color: 0x00ff88, position: [0, -0.5, 0] },
  { name: "Roll Shaft", color: 0xffd700, position: [-1, 0.8, 0] },
  { name: "Gear Drive", color: 0xff6b6b, position: [1.5, 1, 0] },
  { name: "Cutting System", color: 0xb388ff, position: [3.5, 0.8, 0] },
];

type Props = {
  machineColor?: string;
  machineName?: string;
  modelUrl?: string | null;
  onFallbackTo2D?: () => void;
};

type MeshWithMeta = Mesh & {
  partName?: string;
  partColor?: number;
};

type THREE_NS = typeof import("three");

function ThreeViewer({ machineColor, modelUrl }: { machineColor: string; modelUrl?: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number>(0);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const selectedPartRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0.3, y: 0 });
  const zoomLevel = useRef(5);
  const meshesRef = useRef<MeshWithMeta[]>([]);

  useEffect(() => {
    selectedPartRef.current = selectedPart;
  }, [selectedPart]);

  useEffect(() => {
    if (Platform.OS !== "web" || !containerRef.current) return;

    let mounted = true;
    const cleanupFns: (() => void)[] = [];

    const init = async () => {
      const THREE: THREE_NS = await import("three");

      if (!mounted || !containerRef.current) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a1628);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        50,
        VIEWER_WIDTH / VIEWER_HEIGHT,
        0.1,
        100
      );
      camera.position.set(0, 2, zoomLevel.current);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(VIEWER_WIDTH, VIEWER_HEIGHT);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      rendererRef.current = renderer;

      const container = containerRef.current;
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0x334466, 0.8);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 8, 5);
      dirLight.castShadow = true;
      scene.add(dirLight);

      const pointLight1 = new THREE.PointLight(0x00d4ff, 0.5, 20);
      pointLight1.position.set(-5, 3, 3);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xff6b6b, 0.3, 20);
      pointLight2.position.set(5, 3, -3);
      scene.add(pointLight2);

      const gridHelper = new THREE.GridHelper(12, 24, 0x1e3a5f, 0x0f2035);
      gridHelper.position.y = -1;
      scene.add(gridHelper);

      const meshes: MeshWithMeta[] = [];
      let animatedGear: Mesh | null = null;
      let animatedBlade: Mesh | null = null;

      if (modelUrl) {
        try {
          const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
          const loader = new GLTFLoader();

          const gltf = await new Promise<{ scene: Group }>((resolve, reject) => {
            loader.load(
              modelUrl,
              (result) => resolve(result),
              (event) => {
                if (event.total > 0) {
                  setLoadProgress(Math.round((event.loaded / event.total) * 100));
                }
              },
              (err) => reject(err)
            );
          });

          if (!mounted) return;

          const partColorMap: Record<string, number> = {
            "entry": 0x00d4ff,
            "gate": 0x00d4ff,
            "base": 0x00ff88,
            "frame": 0x00ff88,
            "roll": 0xffd700,
            "shaft": 0xffd700,
            "gear": 0xff6b6b,
            "drive": 0xff6b6b,
            "motor": 0xff6b6b,
            "cut": 0xb388ff,
            "blade": 0xb388ff,
          };

          const assignPartColor = (name: string): number => {
            const lower = name.toLowerCase();
            for (const [keyword, color] of Object.entries(partColorMap)) {
              if (lower.includes(keyword)) return color;
            }
            const hash = Array.from(lower).reduce((acc, c) => acc + c.charCodeAt(0), 0);
            const hue = (hash * 137) % 360;
            return new THREE.Color(`hsl(${hue}, 70%, 60%)`).getHex();
          };

          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              const meshChild = child as MeshWithMeta;
              meshChild.partName = child.name || `Part_${meshes.length + 1}`;
              meshChild.partColor = assignPartColor(meshChild.partName);
              meshes.push(meshChild);
            }
          });

          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 6 / maxDim;
          gltf.scene.scale.setScalar(scale);
          gltf.scene.position.sub(center.multiplyScalar(scale));

          scene.add(gltf.scene);
        } catch {
          buildProceduralScene(THREE, scene, meshes);
          const foundGear = scene.getObjectByName("animGear") as Mesh | undefined;
          const foundBlade = scene.getObjectByName("animBlade") as Mesh | undefined;
          animatedGear = foundGear ?? null;
          animatedBlade = foundBlade ?? null;
        }
      } else {
        const { gear, blade } = buildProceduralScene(THREE, scene, meshes);
        animatedGear = gear;
        animatedBlade = blade;
      }

      meshesRef.current = meshes;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const handleClick = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
          const obj = intersects[0].object as MeshWithMeta;
          if (obj.partName) {
            setSelectedPart((prev) =>
              prev === obj.partName ? null : (obj.partName ?? null)
            );
          }
        } else {
          setSelectedPart(null);
        }
      };

      const handleMouseDown = (e: MouseEvent) => {
        isDragging.current = true;
        previousMouse.current = { x: e.clientX, y: e.clientY };
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - previousMouse.current.x;
        const dy = e.clientY - previousMouse.current.y;
        rotation.current.y += dx * 0.01;
        rotation.current.x += dy * 0.01;
        rotation.current.x = Math.max(-1, Math.min(1, rotation.current.x));
        previousMouse.current = { x: e.clientX, y: e.clientY };
      };

      const handleMouseUp = () => {
        isDragging.current = false;
      };

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        zoomLevel.current = Math.max(
          2,
          Math.min(12, zoomLevel.current + e.deltaY * 0.01)
        );
      };

      let touchStart: { x: number; y: number } | null = null;
      let initialPinchDist = 0;

      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          initialPinchDist = Math.sqrt(dx * dx + dy * dy);
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if (e.touches.length === 1 && touchStart) {
          const dx = e.touches[0].clientX - touchStart.x;
          const dy = e.touches[0].clientY - touchStart.y;
          rotation.current.y += dx * 0.01;
          rotation.current.x += dy * 0.01;
          rotation.current.x = Math.max(-1, Math.min(1, rotation.current.x));
          touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const delta = initialPinchDist - dist;
          zoomLevel.current = Math.max(
            2,
            Math.min(12, zoomLevel.current + delta * 0.02)
          );
          initialPinchDist = dist;
        }
      };

      const el = renderer.domElement;
      el.addEventListener("click", handleClick);
      el.addEventListener("mousedown", handleMouseDown);
      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseup", handleMouseUp);
      el.addEventListener("mouseleave", handleMouseUp);
      el.addEventListener("wheel", handleWheel, { passive: false });
      el.addEventListener("touchstart", handleTouchStart);
      el.addEventListener("touchmove", handleTouchMove, { passive: false });

      const animate = () => {
        if (!mounted) return;
        animFrameRef.current = requestAnimationFrame(animate);

        camera.position.x =
          zoomLevel.current * Math.sin(rotation.current.y);
        camera.position.z =
          zoomLevel.current * Math.cos(rotation.current.y);
        camera.position.y = 2 + rotation.current.x * 3;
        camera.lookAt(0, 0, 0);

        if (animatedGear) animatedGear.rotation.z += 0.02;
        if (animatedBlade) animatedBlade.position.y = 0.5 + Math.sin(Date.now() * 0.003) * 0.3;

        const currentSelected = selectedPartRef.current;
        meshes.forEach((mesh: MeshWithMeta) => {
          if (mesh.partName && mesh.material && !Array.isArray(mesh.material)) {
            const mat = mesh.material as MeshStandardMaterial;
            const isHovered = currentSelected === mesh.partName;
            if ("color" in mat && "emissive" in mat) {
              const targetColor = isHovered && mesh.partColor ? mesh.partColor : 0x2a4a6f;
              mat.color.lerp(new THREE.Color(targetColor), 0.1);
              if (isHovered && mesh.partColor) {
                mat.emissive = new THREE.Color(mesh.partColor);
                mat.emissiveIntensity = 0.15;
              } else {
                mat.emissiveIntensity = 0;
              }
            }
          }
        });

        renderer.render(scene, camera);
      };

      animate();
      setLoading(false);

      cleanupFns.push(() => {
        el.removeEventListener("click", handleClick);
        el.removeEventListener("mousedown", handleMouseDown);
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseup", handleMouseUp);
        el.removeEventListener("mouseleave", handleMouseUp);
        el.removeEventListener("wheel", handleWheel);
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchmove", handleTouchMove);
        if (container.contains(el)) {
          container.removeChild(el);
        }
        renderer.dispose();
      });
    };

    init();

    return () => {
      mounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      cleanupFns.forEach((fn) => fn());
    };
  }, [modelUrl]);

  return (
    <View style={styles.viewerWrap}>
      {Platform.OS === "web" && (
        <View
          ref={containerRef as unknown as React.RefObject<View>}
          style={[styles.canvasContainer, { width: VIEWER_WIDTH, height: VIEWER_HEIGHT }]}
        />
      )}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00D4FF" />
          <Text style={styles.loadingText}>
            {loadProgress > 0 ? `Loading model... ${loadProgress}%` : "Loading 3D Model..."}
          </Text>
        </View>
      )}
      <View style={styles.partLegend}>
        {MACHINE_PARTS.map((part) => {
          const isActive = selectedPart === part.name;
          const colorHex = `#${part.color.toString(16).padStart(6, "0")}`;
          return (
            <AnimatedPressable
              key={part.name}
              onPress={() => setSelectedPart((prev) => (prev === part.name ? null : part.name))}
              scaleDown={0.95}
            >
              <View
                style={[
                  styles.partItem,
                  isActive && { backgroundColor: colorHex + "20", borderColor: colorHex },
                ]}
              >
                <View style={[styles.partDot, { backgroundColor: colorHex }]} />
                <Text style={[styles.partLabel, isActive && { color: colorHex }]}>
                  {part.name}
                </Text>
              </View>
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
}

function buildProceduralScene(
  THREE: THREE_NS,
  scene: Scene,
  meshes: MeshWithMeta[]
): { gear: Mesh; blade: Mesh } {
  const baseMat = new THREE.MeshPhongMaterial({
    color: 0x2a4a6f,
    shininess: 30,
    transparent: true,
    opacity: 0.9,
  });

  const baseGeom = new THREE.BoxGeometry(8, 0.3, 1.5);
  const base = new THREE.Mesh(baseGeom, baseMat.clone()) as MeshWithMeta;
  base.position.set(0, -0.85, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  base.partName = "Main Base";
  base.partColor = 0x00ff88;
  scene.add(base);
  meshes.push(base);

  const entryGateGeom = new THREE.BoxGeometry(1.2, 2, 1.2);
  const entryGate = new THREE.Mesh(entryGateGeom, baseMat.clone()) as MeshWithMeta;
  entryGate.position.set(-3.5, 0.2, 0);
  entryGate.castShadow = true;
  entryGate.partName = "Entry Gate";
  entryGate.partColor = 0x00d4ff;
  scene.add(entryGate);
  meshes.push(entryGate);

  const slotGeom = new THREE.BoxGeometry(0.1, 1.2, 0.8);
  const slot = new THREE.Mesh(
    slotGeom,
    new THREE.MeshPhongMaterial({ color: 0x0a1628 })
  );
  slot.position.set(-3.5, 0.3, 0);
  scene.add(slot);

  const shaftGroup = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const topRoller = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 1, 16),
      new THREE.MeshPhongMaterial({ color: 0x4a7a9f, shininess: 60 })
    );
    topRoller.rotation.x = Math.PI / 2;
    topRoller.position.set(-1.5 + i * 0.6, 0.5, 0);
    topRoller.castShadow = true;
    shaftGroup.add(topRoller);

    const bottomRoller = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 1, 16),
      new THREE.MeshPhongMaterial({ color: 0x3a6a8f, shininess: 60 })
    );
    bottomRoller.rotation.x = Math.PI / 2;
    bottomRoller.position.set(-1.5 + i * 0.6, 0, 0);
    bottomRoller.castShadow = true;
    shaftGroup.add(bottomRoller);
  }

  const shaftHousing = new THREE.Mesh(
    new THREE.BoxGeometry(4, 1.8, 1.3),
    baseMat.clone()
  ) as MeshWithMeta;
  shaftHousing.position.set(-0.3, 0.2, 0);
  shaftHousing.castShadow = true;
  shaftHousing.partName = "Roll Shaft";
  shaftHousing.partColor = 0xffd700;
  shaftGroup.add(shaftHousing);
  scene.add(shaftGroup);
  meshes.push(shaftHousing);

  const gearGroup = new THREE.Group();
  const gearBox = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2, 1.2),
    baseMat.clone()
  ) as MeshWithMeta;
  gearBox.position.set(2.2, 0.2, 0);
  gearBox.castShadow = true;
  gearBox.partName = "Gear Drive";
  gearBox.partColor = 0xff6b6b;
  gearGroup.add(gearBox);
  meshes.push(gearBox);

  const gear = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.08, 8, 20),
    new THREE.MeshPhongMaterial({ color: 0x6a8abf, shininess: 80 })
  );
  gear.position.set(2.2, 0.5, 0.65);
  gear.name = "animGear";
  gearGroup.add(gear);
  scene.add(gearGroup);

  const cutGroup = new THREE.Group();
  const cutHousing = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2.2, 1.2),
    baseMat.clone()
  ) as MeshWithMeta;
  cutHousing.position.set(3.8, 0.3, 0);
  cutHousing.castShadow = true;
  cutHousing.partName = "Cutting System";
  cutHousing.partColor = 0xb388ff;
  cutGroup.add(cutHousing);
  meshes.push(cutHousing);

  const blade = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 1.5, 0.8),
    new THREE.MeshPhongMaterial({
      color: 0xff4444,
      emissive: 0x330000,
      shininess: 100,
    })
  );
  blade.position.set(3.8, 0.5, 0);
  blade.name = "animBlade";
  cutGroup.add(blade);
  scene.add(cutGroup);

  return { gear, blade };
}

export default function MachineViewer3D({
  machineColor = "#1A56DB",
  machineName = "Roll Forming Machine",
  modelUrl,
  onFallbackTo2D,
}: Props) {
  if (Platform.OS !== "web") {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContainer}>
          <Feather name="box" size={48} color="#64748B" />
          <Text style={styles.fallbackTitle}>3D View</Text>
          <Text style={styles.fallbackText}>
            3D viewer requires a web browser. Switch to 2D View for technical drawings.
          </Text>
          {onFallbackTo2D && (
            <AnimatedPressable onPress={onFallbackTo2D} scaleDown={0.95}>
              <View style={[styles.fallbackBtn, { borderColor: machineColor }]}>
                <Feather name="layers" size={16} color={machineColor} />
                <Text style={[styles.fallbackBtnText, { color: machineColor }]}>
                  Switch to 2D View
                </Text>
              </View>
            </AnimatedPressable>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>3D Model</Text>
        <Text style={styles.subtitle}>
          Drag to rotate {"\u2022"} Scroll to zoom {"\u2022"} Tap parts to highlight
        </Text>
      </View>
      <ThreeViewer machineColor={machineColor} modelUrl={modelUrl} />
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
  viewerWrap: {
    position: "relative",
  },
  canvasContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#0A1628",
    borderWidth: 1,
    borderColor: "#1E3A5F",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 22, 40, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    gap: 12,
  },
  loadingText: {
    color: "#64748B",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  partLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  partItem: {
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
  partDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  partLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontFamily: "Inter_500Medium",
  },
  fallbackContainer: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  fallbackTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E2E8F0",
    fontFamily: "Inter_600SemiBold",
  },
  fallbackText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
  },
  fallbackBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    marginTop: 8,
  },
  fallbackBtnText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});
