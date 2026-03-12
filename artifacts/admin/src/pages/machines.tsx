import { useState } from "react";
import { useMachines } from "@/hooks/use-machines";
import { Button } from "@/components/ui/button";
import { Plus, Search, Cpu, MoreVertical, Image as ImageIcon, Box } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MachineForm } from "@/components/MachineForm";
import { Link } from "wouter";
import { format } from "date-fns";

export default function MachinesList() {
  const { data: machines, isLoading } = useMachines();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredMachines = machines?.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Machine Registry</h1>
          <p className="text-muted-foreground mt-1">Manage hardware profiles and visual assets.</p>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 gap-2 font-medium"
        >
          <Plus className="w-4 h-4" /> Add Machine
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by name or model..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background border-border/50 focus-visible:ring-primary/20 h-9"
            />
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            {filteredMachines?.length || 0} Records
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
               <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filteredMachines?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Cpu className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>
              <h3 className="font-semibold text-lg">No machines found</h3>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or create a new machine.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 font-semibold sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 border-b border-border font-medium">Machine</th>
                  <th className="px-6 py-4 border-b border-border font-medium">Model Code</th>
                  <th className="px-6 py-4 border-b border-border font-medium text-center">Visual Assets</th>
                  <th className="px-6 py-4 border-b border-border font-medium">Registered</th>
                  <th className="px-6 py-4 border-b border-border font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredMachines?.map((machine) => (
                  <tr key={machine.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-foreground">{machine.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground text-xs">
                      {machine.model}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          machine.has2d 
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                            : 'bg-muted text-muted-foreground border-transparent opacity-50'
                        }`}>
                          <ImageIcon className="w-3 h-3" /> 2D
                        </div>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          machine.has3d 
                            ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' 
                            : 'bg-muted text-muted-foreground border-transparent opacity-50'
                        }`}>
                          <Box className="w-3 h-3" /> 3D
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(machine.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/machines/${machine.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-xs font-medium bg-background border border-border group-hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all">
                          Manage Assets
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <MachineForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}
