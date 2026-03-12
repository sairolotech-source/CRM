import { useVisualizationSettings, useUpdateVisualizationSettings } from "@/hooks/use-settings";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings2, Eye, Box, PlaySquare, Highlighter, DownloadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Settings() {
  const { data: settings, isLoading } = useVisualizationSettings();
  const updateSettings = useUpdateVisualizationSettings();
  const { toast } = useToast();

  const handleToggle = async (key: keyof typeof updateSettings.mutateAsync extends (args: infer A) => any ? (A extends {data: infer D} ? keyof D : never) : never, value: boolean) => {
    try {
      await updateSettings.mutateAsync({
        data: { [key]: value }
      });
      toast({
        title: "Settings Updated",
        description: "Global visualization preferences have been saved.",
      });
    } catch (e) {
      toast({
        title: "Update Failed",
        description: "Could not save settings.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
         <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const toggleItems = [
    {
      key: 'enable2dView' as const,
      label: 'Enable 2D Drawing View',
      description: 'Allow end-users to view 2D technical drawings of machines.',
      icon: Eye,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      key: 'enable3dView' as const,
      label: 'Enable Interactive 3D Viewer',
      description: 'Activate WebGL-based 3D model viewer for supported machines.',
      icon: Box,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      key: 'enableAnimation' as const,
      label: 'Enable 3D Animations',
      description: 'Allow playback of embedded animations in GLTF/GLB files.',
      icon: PlaySquare,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      key: 'enablePartHighlight' as const,
      label: 'Interactive Part Highlighting',
      description: 'Enable click-to-highlight functionality for individual mesh nodes.',
      icon: Highlighter,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      key: 'enableTechnicalDrawingDownload' as const,
      label: 'Enable Drawing Downloads',
      description: 'Show download button for high-resolution 2D assets.',
      icon: DownloadCloud,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10'
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
          <Settings2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Global Settings</h1>
          <p className="text-muted-foreground mt-1">Configure client-facing visualization features.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50 bg-muted/10">
          <h2 className="font-semibold flex items-center gap-2">
            <div className="w-1.5 h-4 bg-primary rounded-full"></div>
            Feature Flags
          </h2>
          <p className="text-sm text-muted-foreground mt-1 ml-3.5">
            Changes made here take effect immediately for all end-users.
          </p>
        </div>
        
        <div className="divide-y divide-border/50">
          {toggleItems.map((item, i) => (
            <motion.div 
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 flex items-start justify-between gap-8 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <Label htmlFor={item.key} className="text-base font-semibold cursor-pointer">
                    {item.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    {item.description}
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <Switch 
                  id={item.key}
                  checked={settings?.[item.key] ?? false}
                  onCheckedChange={(checked) => handleToggle(item.key, checked)}
                  disabled={updateSettings.isPending || !settings}
                  className="data-[state=checked]:bg-primary shadow-inner"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
