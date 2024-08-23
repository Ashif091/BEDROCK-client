"use client"
import React from "react"
import {HoverBorderGradient} from "../effects/hover-border-gradient"
import {useRouter} from "next/navigation"
export function GetFreeButton() {
  const router = useRouter()
    const clickFun = ()=>{

        router.push("/workspace")
    }
  return (

    <div onClick={clickFun} className="mt-12 flex justify-center text-center text-2xl cursor-pointer">
      <HoverBorderGradient
        containerClassName="rounded-2xl"
        as="button"
        className=" px-14 dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <span>Get Bedrock Free</span>
      </HoverBorderGradient>
    </div>
  )
}
