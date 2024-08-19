"use client"
import Link from "next/link"
import React, {useEffect, useState} from "react"
import Logo from "@/components/ui/logo"

const Header = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    document.body.classList.add('dark-scrollbar')
  }, [])
  if (!mounted) {
    return null
  }
  return (
    <header className=" flex justify-center h-16 items-center sticky  backdrop-blur-sm z-40 top-3 w-full px-5 ">
      <Logo/>
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
