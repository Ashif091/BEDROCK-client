"use client"

import { BackgroundBeams } from "@/components/ui/background-beams";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {

  return (

    <main className=''>
      <BackgroundBeams/>
      {children}
    </main>
  );
};

export default AdminLayout