"use client"
import React, { useEffect, useState } from "react";
import { Compare } from "@/components/ui/compare";
import { ContainerScroll } from "../effects/container-scroll-animation";
import graph_page from "../../../public/graph-page.png"
import profile_page from "../../../public/profile-page.png"
export function ComparePage() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
      setMounted(true)
      document.body.classList.add('dark-scrollbar')
    }, [])
    if (!mounted) {
      return null
    }
  return (
    // <ContainerScroll
    //   titleComponent={
    //     <>
    //       <h1 className="text-4xl font-semibold text-black dark:text-white">
    //         Unleash the power of 
    //       </h1>
    //     </>
    //   }
    // >

    // </ContainerScroll>
    <div className="relative w-full h-[90vh]  flex items-center justify-center ">

    <div className="relative w-3/4 h-1/2 md:h-3/4 mx-auto p-1 md:p-4 rounded-3xl dark:bg-neutral-900 bg-neutral-100 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#010027] to-transparent opacity-80"></div>
      </div>

      <Compare
        firstImage={graph_page}
        secondImage={profile_page}
        firstImageClassName="object-cover object-left-top w-full"
        secondImageClassname="object-cover object-left-top w-full"
        className="relative z-10 w-full h-full rounded-[22px] md:rounded-lg"
        slideMode="hover"
        autoplay={true}
      />
    </div>
  </div>
  );
}
