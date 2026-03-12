import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateMachine } from "@/hooks/use-machines";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const MACHINE_CATEGORIES = [
  "Rolling Mill",
  "Hydraulic Press",
  "Wire Drawing",
  "Tube Mill",
  "Cut to Length",
  "Slitting Line",
  "Other",
] as const;

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  model: z.string().min(2, "Model is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MachineFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MachineForm({ open, onOpenChange }: MachineFormProps) {
  const { toast } = useToast();
  const createMachine = useCreateMachine();
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      model: "",
      category: "",
      description: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createMachine.mutateAsync({ data });
      toast({
        title: "Machine Created",
        description: `${data.name} has been added to the system.`,
      });
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create machine",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-border bg-card shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-full"></div>
            Register New Machine
          </DialogTitle>
          <DialogDescription>
            Enter the details for the new machine to add it to the visualization registry.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold uppercase text-muted-foreground">Machine Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Industrial Lathe X-200" 
              className="bg-background focus-visible:ring-primary/20"
              {...register("name")} 
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model" className="text-xs font-semibold uppercase text-muted-foreground">Model Number</Label>
            <Input 
              id="model" 
              placeholder="e.g. LTH-X200-V2" 
              className="bg-background focus-visible:ring-primary/20 font-mono text-sm"
              {...register("model")} 
            />
            {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-xs font-semibold uppercase text-muted-foreground">Category</Label>
            <Select value={watch("category")} onValueChange={(val) => setValue("category", val, { shouldValidate: true })}>
              <SelectTrigger className="bg-background focus:ring-primary/20">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {MACHINE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-semibold uppercase text-muted-foreground">Description (Optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Technical specifications or notes..." 
              className="bg-background min-h-[100px] resize-none focus-visible:ring-primary/20"
              {...register("description")} 
            />
          </div>

          <DialogFooter className="pt-4 border-t border-border/50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="hover:bg-muted"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || createMachine.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {isSubmitting ? "Registering..." : "Create Machine"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
