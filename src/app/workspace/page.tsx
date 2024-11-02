"use client"
import {useEffect, useState} from "react"
import WithAuth from "../../components/hoc/withAuth"
import Logo from "@/components/ui/logo"
import List from "@/components/workspace-list/list"
import Image from "next/image"
import explore from "../../../public/explore.png"
import link_icon from "../../../public/foreign.png"
import Link from "next/link"
import SparkleEffect from "@/components/effects/sparkles"
const Workspace = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    document.body.classList.add("dark-scrollbar")
    document.body.classList.add("bg-dark-blue")
  }, [])
  if (!mounted) {
    return (
      <main className="pb-[10rem]">
        <div className="absolute top-16 left-0 right-0 h-[48vh] bg-gradient-to-t from-[#7457EE]/[.16] via-[#7457EE]/[.08] to-transparent">
          <SparkleEffect />
        </div>
        <Logo className="ml-7 mt-5" width={60} fontSize={"xl"} />
        <div className=" pt-14 pl-36 h-lvh">
          <p className="text-xl font-alata">Your workspace</p>
          <List />
        </div>
      </main>
    )
  }

  return (
    <main className="pb-[10rem]">
      <div className="absolute top-16 left-0 right-0 h-[48vh] bg-gradient-to-t from-[#7457EE]/[.16] via-[#7457EE]/[.08] to-transparent">
        <SparkleEffect />
      </div>
      <Logo className="ml-7 mt-5" width={60} fontSize={"xl"} />
      <div className=" pt-14 pl-36 h-lvh">
        <List />
        <section className=" w-[18rem] h-48 z-10 mt-20   rounded-md border border-gray-100 border-opacity-35  flex items-center justify-center cursor-pointer select-none">
          <div>
            <Image
              width={35}
              alt="add_icon"
              src={explore}
              className="flex m-auto opacity-50"
            />
            <p className=" mt-5 text-center text-xl opacity-50">
              Preparing demo <br />
              project...
            </p>
          </div>
        </section>
        <div className="absolute right-44 flex gap-4 justify-between opacity-55">
          <Link href={"/"}>
            <p className="flex">
              Support{" "}
              <Image
                width={16}
                className="object-contain"
                alt="link"
                src={link_icon}
              />
            </p>
          </Link>
          <Link href={"/"}>
            <p className="flex">
            Terms{" "}
              <Image
                width={16}
                className="object-contain"
                alt="link"
                src={link_icon}
              />
            </p>
          </Link>
          <Link href={"/"}>
            <p className="flex">
            Privacy policy{" "}
              <Image
                width={16}
                className="object-contain"
                alt="link"
                src={link_icon}
              />
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default WithAuth(Workspace)
