import { useWorkspaceStore } from "@/stores/workspaceStore"
import Image from "next/image"
import down_arrow from "../../../../../public/sidebar/arrow-down-sign-to-navigate.png"
import add_ico from "../../../../../public/sidebar/add.png"
import doc_icon from "../../../../../public/sidebar/document.png"

const InfoBar= () => {
    const {currentlyWorking} = useWorkspaceStore()
    const icon = currentlyWorking?.icon ? currentlyWorking.icon : doc_icon
  return (
    <div className=" flex mb-3 items-center text-center p-1  rounded  justify-between">
    <div className="flex ">
      <Image
        src={icon as string}
        width={10}
        height={10}
        alt="../../../../public/sidebar/document.png"
        className="w-[25px] mr-2  border border-gray-200/20 rounded-md"
      />
      <span className="capitalize flex gap-1 opacity-60">
        {currentlyWorking?.title}
        <Image
          src={down_arrow}
          className="w-[10px] object-contain  opacity-25"
          alt=","
        />
      </span>
    </div>
    <Image src={add_ico} alt="add" className="w-[18px] cursor-pointer opacity-40" />
  </div>
  )
}

export default InfoBar