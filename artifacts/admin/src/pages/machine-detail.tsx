import { useParams } from "wouter";
import { useMachine } from "@/hooks/use-machines";
import { useMachineAssets, useUploadMachineAsset, useDeleteMachineAsset } from "@/hooks/use-assets";
import { FileUploadZone } from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Cpu, ArrowLeft, Trash2, FileCode, Box, Image as ImageIcon } from "lucide-react";
import { Link } from "wouter";
import { formatBytes } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function MachineDetail() {
  const { id } = useParams<{ id: string }>();
  const machineId = parseInt(id, 10);
  
  const { data: machine, isLoading: isMachineLoading } = useMachine(machineId);
  const { data: assets, isLoading: isAssetsLoading } = useMachineAssets(machineId);
  
  const uploadMutation = useUploadMachineAsset();
  const deleteMutation = useDeleteMachineAsset();
  const { toast } = useToast();

  const handleUpload = async (file: File, assetType: '2d' | '3d') => {
    try {
      await uploadMutation.mutateAsync({ machineId, file, assetType });
      toast({
        title: "Upload Successful",
        description: `${file.name} has been processed and saved.`,
      });
    } catch (e: any) {
      throw e; // Rethrow to let FileUploadZone handle local error state
    }
  };

  const handleDelete = async (assetId: number, fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;
    
    try {
      await deleteMutation.mutateAsync({ machineId, assetId });
      toast({
        title: "Asset Deleted",
        description: "The file has been permanently removed.",
      });
    } catch (e) {
      toast({
        title: "Deletion Failed",
        description: "Could not remove the asset. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isMachineLoading) {
    return (
      <div className="flex items-center justify-center h-full">
         <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!machine) {
    return <div>Machine not found</div>;
  }

  const assets2d = assets?.filter(a => a.assetType === '2d') || [];
  const assets3d = assets?.filter(a => a.assetType === '3d') || [];
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <Link href="/machines" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Registry
        </Link>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-start justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex items-start gap-5 relative z-10">
            <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
              <Cpu className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">{machine.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground font-semibold border border-border/50">
                  {machine.model}
                </code>
                <span className="text-xs text-muted-foreground">ID: {machine.id}</span>
              </div>
              {machine.description && (
                <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">{machine.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2D Assets Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-display font-bold">2D Technical Drawings</h2>
          </div>
          
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
            <FileUploadZone 
              label="Upload 2D Asset"
              description="SVG or PNG (Max 10MB)"
              accept={{ 'image/svg+xml': ['.svg'], 'image/png': ['.png'] }}
              maxSize={10 * 1024 * 1024}
              onUpload={(file) => handleUpload(file, '2d')}
            />

            {isAssetsLoading ? (
              <div className="h-24 flex items-center justify-center text-muted-foreground"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
            ) : assets2d.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence>
                  {assets2d.map(asset => (
                    <motion.div 
                      key={asset.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative rounded-xl border border-border overflow-hidden bg-muted/30 aspect-square flex items-center justify-center"
                    >
                      <div className="absolute inset-0 p-4">
                        <img 
                          src={asset.filePath.startsWith('/') ? `${baseUrl}/../api${asset.filePath}` : asset.filePath} 
                          alt={asset.fileName}
                          className="w-full h-full object-contain filter drop-shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGExYjIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIi8+PHBhdGggZD0ibTIxIDE1LTMuMDgtMy4wOGExLjIgMS4yIDAgMCAwLTEuNzEgMGwtOS42NyA5LjY3Ii8+PC9zdmc+';
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                        <p className="text-xs font-medium text-foreground truncate w-full mb-1">{asset.displayName || asset.fileName}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mb-3">{formatBytes(asset.fileSize)}</p>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="h-7 text-xs w-full gap-1 shadow-md"
                          onClick={() => handleDelete(asset.id, asset.fileName)}
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center p-6 border border-dashed rounded-xl bg-muted/20">
                <p className="text-sm text-muted-foreground">No 2D drawings uploaded yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* 3D Assets Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Box className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-display font-bold">3D Models</h2>
          </div>
          
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
            <FileUploadZone 
              label="Upload 3D Model"
              description="GLB, GLTF, OBJ (Max 50MB)"
              accept={{ 'model/gltf-binary': ['.glb'], 'model/gltf+json': ['.gltf'], 'model/obj': ['.obj'] }}
              maxSize={50 * 1024 * 1024}
              onUpload={(file) => handleUpload(file, '3d')}
            />

            {isAssetsLoading ? (
              <div className="h-24 flex items-center justify-center text-muted-foreground"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
            ) : assets3d.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {assets3d.map(asset => (
                    <motion.div 
                      key={asset.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-background border border-border/50 flex items-center justify-center shrink-0 shadow-sm text-muted-foreground group-hover:text-primary transition-colors">
                          <FileCode className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{asset.displayName || asset.fileName}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            <span className="font-mono">{formatBytes(asset.fileSize)}</span>
                            <span>•</span>
                            <span>{format(new Date(asset.createdAt), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => handleDelete(asset.id, asset.fileName)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center p-6 border border-dashed rounded-xl bg-muted/20">
                <p className="text-sm text-muted-foreground">No 3D models uploaded yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
