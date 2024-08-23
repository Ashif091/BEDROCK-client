// components/FeaturesDisplay.tsx
import React from "react";
import Card from "@/components/ui/card"
import collab_png from "../../../public/Features/sandglass.png"
import links_png from "../../../public/Features/link (1).png"
import doc_png from "../../../public/Features/document.png"
import meet_png from "../../../public/Features/online-meeting.png"
import graph_png from "../../../public/Features/data-flow.png"

const features = [
  {
    imageSrc: collab_png, 
    title: "RealTime colab",
    description: "Connect with people and work on a same Doc Realtime.",
  },
  {
    imageSrc: links_png,
    title: "Links",
    description: "Create connections between your notes. Link anything and everything.",
  },
  {
    imageSrc: graph_png,
    title: "Graph",
    description: "Visualize the relationships between your notes.",
  },
  {
      imageSrc: meet_png,
      title: "Meeting Room",
      description: "Join face-to-face meetings with your team in real-time rooms.",
    },
    {
      imageSrc: doc_png,
      title: "Publish Docs",
      description: "Publish your works Online.",
    },
];

const FeaturesDisplay: React.FC = () => {
  return (
    <section className="container w-[70%]  mt-20  py-12">
      <div className="flex flex-wrap justify-center gap-8">
        {features.map((feature, index) => (
          <div key={index} className="w-full sm:w-[30%]">
            <Card 
              imageSrc={feature.imageSrc}
              title={feature.title}
              description={feature.description}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesDisplay;
