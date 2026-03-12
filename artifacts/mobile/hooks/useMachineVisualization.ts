import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";

const API_BASE = Platform.OS === "web"
  ? "/api"
  : `https://${process.env.EXPO_PUBLIC_DOMAIN}/api`;

export type Part2D = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MachineVisualizationData = {
  parts2D: Part2D[];
  drawingUrls: string[];
  model3DUrl: string | null;
  has3DModel: boolean;
};

export type AdminSettings = {
  show2DView: boolean;
  show3DView: boolean;
  showVideos: boolean;
  showQuotation: boolean;
  showSpecifications: boolean;
};

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  show2DView: true,
  show3DView: true,
  showVideos: true,
  showQuotation: true,
  showSpecifications: true,
};

const DEFAULT_VIZ: MachineVisualizationData = {
  parts2D: [
    { id: "entry-gate", label: "Entry Gate", x: 50, y: 120, width: 80, height: 140 },
    { id: "main-base", label: "Main Base", x: 50, y: 260, width: 700, height: 40 },
    { id: "roll-shaft", label: "Roll Shaft", x: 180, y: 100, width: 200, height: 120 },
    { id: "gear-drive", label: "Gear Drive", x: 430, y: 80, width: 120, height: 140 },
    { id: "cutting-system", label: "Cutting System", x: 600, y: 100, width: 100, height: 160 },
  ],
  drawingUrls: [],
  model3DUrl: null,
  has3DModel: false,
};

export function useMachineVisualization(machineId: string) {
  const [vizData, setVizData] = useState<MachineVisualizationData>(DEFAULT_VIZ);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisualization = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/machines/${machineId}/viewer-data`);
      if (res.ok) {
        const data = await res.json();
        type VisualizationRecord = { id: number; fileType: string; fileUrl: string; label?: string; fileName?: string };
        const visualizations: VisualizationRecord[] = data.visualizations || [];
        const files2D = visualizations.filter((v) => v.fileType === "2d");
        const files3D = visualizations.filter((v) => v.fileType === "3d");

        const hasParts = files2D.length > 0;
        const has3D = files3D.length > 0;

        setVizData({
          parts2D: hasParts
            ? files2D.map((v, i) => ({
                id: String(v.id),
                label: v.label || v.fileName || `Part ${i + 1}`,
                x: 50 + i * 150,
                y: 100,
                width: 120,
                height: 120,
              }))
            : DEFAULT_VIZ.parts2D,
          drawingUrls: files2D.map((v) => v.fileUrl),
          model3DUrl: has3D ? files3D[0].fileUrl : null,
          has3DModel: has3D,
        });
      } else {
        setError(`Failed to load visualization (${res.status})`);
        setVizData(DEFAULT_VIZ);
      }
    } catch {
      setError("Network error loading visualization data");
      setVizData(DEFAULT_VIZ);
    } finally {
      setLoading(false);
    }
  }, [machineId]);

  useEffect(() => {
    fetchVisualization();
  }, [fetchVisualization]);

  return { vizData, loading, error, refetch: fetchVisualization };
}

export function useAdminSettings(machineId: string) {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/machines/${machineId}/admin-settings`);
        if (res.ok) {
          const data = await res.json();
          setSettings({
            show2DView: data.enable2dView ?? true,
            show3DView: data.enable3dView ?? true,
            showVideos: true,
            showQuotation: true,
            showSpecifications: true,
          });
        }
      } catch {
        setSettings(DEFAULT_ADMIN_SETTINGS);
      } finally {
        setLoading(false);
      }
    })();
  }, [machineId]);

  return { settings, loading };
}
