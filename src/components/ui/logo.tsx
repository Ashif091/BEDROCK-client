import React from "react"
import Image from "next/image"
import Link from "next/link"
import LogoDark from "../../../public/logo-dark.png"
import { mcn } from "../lib/utils"
interface LogoProps {
  width?: number
  scaleY?: number
  fontSize?: string
  className?: string
}

const Logo: React.FC<LogoProps> = ({
  width = 70,
  scaleY = 150,
  fontSize = "2xl",
  className = "",
}) => {
  return (
    <Link
      className={ mcn("w-full  flex justify-start items-center",`${className}`) }
      href="/"
    >
      <Image src={LogoDark} width={width} className="" alt="logo" />
      <h1
        className={ mcn("font-koulen  font-bold",`scale-y-150`,`text-${fontSize}`)}
      >
        BEDROCK
      </h1>
    </Link>
  )
}

export default Logo
