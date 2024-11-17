"use client"

import NetworkBackground from "@/components/effects/NetworkBackground";
import { BackgroundBeams } from "@/components/ui/background-beams";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {

  return (

    <main className="fixed h-screen w-full overflow-hidden text-white">
      <NetworkBackground /> 
      <div className="relative z-10 h-full overflow-auto">
        {children}
      </div>
    </main>
  );
};

export default AdminLayout