"use client"
import FeaturesDisplay from "@/components/landing-page/FeaturesDisplay"
import { GetFreeButton } from "@/components/ui/getFreeButton"
import { useEffect, useState } from "react"
import Image from "next/image"
import tap_png from "../../../public/tap_phone.png"
const Home = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    document.body.classList.add('dark-scrollbar')
  }, [])
  if (!mounted) {
    return null
  }
  return (
    <main className="flex flex-col items-center  min-h-screen p-4 mt-14  ">
      <h1 className="text-6xl  text-center font-bold max-w-[40rem] leading-relaxed">
        Link Your Thoughts <br /> And <br /> Build Together
      </h1>
      <span className="text-2xl">Collaborate Beyond Folders.</span>
      <GetFreeButton/>
      <FeaturesDisplay/>
      <div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#010027]/[.9]  via-[#7457EE]/[.08]  to-transparent opacity-90"></div>
      </div>
      <Image src={tap_png} alt="..." width={650}/>
      </div>
    </main>
  )
}

export default Home
