import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-background bg-blueprint text-foreground font-sans">
      {/* Blueprint overlay for the whole app background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-multiply" 
           style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/blueprint-bg.png)`, backgroundSize: 'cover' }}></div>
      
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="h-16 border-b bg-background/80 backdrop-blur-md flex items-center px-8 sticky top-0 z-20">
           <div className="flex-1" />
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">
                AD
              </div>
           </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
