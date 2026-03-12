import { Link, useLocation } from "wouter";
import { LayoutDashboard, Settings, Box, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/machines", label: "Machines", icon: Cpu },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 border-r bg-card/50 backdrop-blur-xl flex flex-col h-screen sticky top-0 relative z-20">
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-inner">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight text-foreground">VISUAL_SYS</h1>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Admin Panel v1.0</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative group overflow-hidden",
                isActive 
                  ? "text-primary bg-primary/10 shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav" 
                  className="absolute left-0 w-1 h-full bg-primary rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50 bg-muted/20">
        <div className="bg-blueprint w-full h-24 rounded-lg border border-border/50 overflow-hidden relative opacity-70">
           <img 
              src={`${import.meta.env.BASE_URL}images/blueprint-bg.png`} 
              alt="Blueprint Accent" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50"
           />
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded text-xs font-mono text-muted-foreground border border-border/50">
               SYSTEM_ONLINE
             </div>
           </div>
        </div>
      </div>
    </aside>
  );
}
