import React from "react"
import Image from "next/image"
import {CardSpotlight} from "./card-spotlight"
interface CardProps {
  imageSrc: any
  title: string
  description: string
}

const Card: React.FC<CardProps> = ({imageSrc, title, description}) => {
  return (
    <CardSpotlight className="w-60 h-52 cursor-cell select-none">
      <div className="border   rounded-lg p-4 bg-[#05032e] w-60 h-52  shadow-md flex flex-col items-start ">
        <Image
          src={imageSrc}
          alt={title}
          className="w-8 h-8 mb-4 object-contain z-20"
        />
        <h3 className="text-xl font-bold mb-2 z-20">{title}</h3>
        <p className="text-gray-500 z-20">{description}</p>
      </div>
    </CardSpotlight>
  )
}

export default Card
