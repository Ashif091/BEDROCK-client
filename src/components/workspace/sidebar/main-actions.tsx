import Image from "next/image"
import home_img from "../../../../public/sidebar/home.png"
import graph_img from "../../../../public/sidebar/graph.png"

interface ActionBarProps {
  setActiveComponent: (component: string) => void
  activeComponent: string
}

const ActionBar: React.FC<ActionBarProps> = ({
  setActiveComponent,
  activeComponent,
}) => {
  const actionItems = [
    {name: "Home", icon: home_img},
    {name: "Graph", icon: graph_img},
  ]

  return (
    <>
      {actionItems.map((item) => (
        <div
          key={item.name}
          className={`action-item flex items-center text-center p-1 cursor-pointer rounded ${
            activeComponent === item.name
              ? "bg-[#2b2b2b]"
              : "hover:bg-[#2b2b2b]"
          }`}
          onClick={() => setActiveComponent(item.name)}
        >
          <Image
            src={item.icon}
            width={10}
            height={10}
            alt={item.name}
            className="w-[18px] mr-2 opacity-45"
          />
          <span className="text-white opacity-50 text-sm font-light">
            {item.name}
          </span>
        </div>
      ))}
    </>
  )
}

export default ActionBar
