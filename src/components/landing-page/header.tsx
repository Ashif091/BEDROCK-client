"use client"
import Link from "next/link"
import Image from "next/image"
import React, {useEffect, useState} from "react"
import LogoDark from "../../../public/logo.png"

const Header = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  return (
    <header className=" flex justify-center h-16 items-center sticky  backdrop-blur-sm z-40 top-3 w-full px-5 ">
      <Link
        className="w-full flex 
      justify-start items-center"
        href={"/"}
      >
        <Image src={LogoDark} width={70} className="" alt="logo"></Image>{" "}
        <h1 className="font-koulen text-2xl font-bold transform scale-y-150">
          BEDROCK
        </h1>
      </Link>
      <div className="md:flex gap-6 hidden  border px-20 rounded-full outline outline-brand/brand-Dark dark:outline-Washed-purple/washed-purple-50 outline-[.1px] py-[.45rem]">
        <Link href={"/"}>Home</Link>
        <Link href={"/"}>Features</Link>
        <Link href={"/"}>About</Link>
      </div>
      <aside className="flex w-full gap-2 justify-end items-center">
        <Link href={"/login"}>Login</Link>
        <Link href={"/signup"}>
          <button className="rounded-md bg-white text-black px-4 py-2">
            SignUp
          </button>
        </Link>
      </aside>
    </header>
  )
}

export default Header
