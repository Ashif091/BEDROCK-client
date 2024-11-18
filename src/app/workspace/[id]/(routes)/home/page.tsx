"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/workspace");
  }, [router]);

  return <div></div>;
};

export default HomePage;
