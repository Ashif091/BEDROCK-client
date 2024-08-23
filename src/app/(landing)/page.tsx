import FeaturesDisplay from "@/components/landing-page/FeaturesDisplay"
import { GetFreeButton } from "@/components/ui/getFreeButton"

const Home = () => {
  return (
    <main className="flex flex-col items-center  min-h-screen p-4 mt-14  ">
      <h1 className="text-6xl  text-center font-bold max-w-[40rem] leading-relaxed">
        Link Your Thoughts <br /> And <br /> Build Together
      </h1>
      <span className="text-2xl">Collaborate Beyond Folders.</span>
      <GetFreeButton/>
      <FeaturesDisplay/>
    </main>
  )
}

export default Home
