import { useMachines } from "@/hooks/use-machines";
import { Cpu, Box, Image as ImageIcon, Activity, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: machines, isLoading } = useMachines();

  const totalMachines = machines?.length || 0;
  const with2D = machines?.filter(m => m.has2d).length || 0;
  const with3D = machines?.filter(m => m.has3d).length || 0;

  const stats = [
    { label: "Total Machines", value: totalMachines, icon: Cpu, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "2D Assets Configured", value: with2D, icon: ImageIcon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "3D Models Configured", value: with3D, icon: Box, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">System Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor your machine visualization pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-4xl font-display font-bold text-foreground mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="w-3 h-3 text-primary" />
              <span>Live tracking</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            Recently Added
          </h2>
          <Link href="/machines" className="text-sm font-medium text-primary flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {machines && machines.length > 0 ? (
            <div className="divide-y divide-border">
              {machines.slice(0, 5).map((machine) => (
                <Link key={machine.id} href={`/machines/${machine.id}`}>
                  <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{machine.name}</h3>
                        <p className="text-xs font-mono text-muted-foreground mt-0.5">{machine.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${machine.has2d ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                        2D
                      </span>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${machine.has3d ? 'bg-purple-500/10 text-purple-600' : 'bg-muted text-muted-foreground'}`}>
                        3D
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Box className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No machines registered yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
