"use client"

import React, { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useRouter } from "next/navigation"
import { useDocumentStore } from "@/stores/documentStore"
import { useWorkspaceStore } from "@/stores/workspaceStore"

interface NodeData {
  id: string
  label: string
  link: string[]
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

const Graph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { documents } = useDocumentStore()
  const { currentlyWorking } = useWorkspaceStore()
  const defaultNodes: NodeData[] = [
    { id: "Untitled", label: "Untitled", link: [] },
  ]
  const [nodes, setNodes] = useState<NodeData[]>(defaultNodes)
  const router = useRouter()

  useEffect(() => {
    const data: NodeData[] = documents
      .filter((doc): doc is typeof doc & { _id: string } => doc._id !== undefined)
      .map((doc) => ({
        id: doc._id,
        label: doc.title,
        link: doc.edges || [],
      }))
    setNodes(data)
  }, [documents])

  useEffect(() => {
    if (nodes.length === 0) return

    const width = containerRef.current?.offsetWidth || 600
    const height = containerRef.current?.offsetHeight || 400

    const links = nodes.flatMap((node) =>
      node.link.map((targetId) => ({
        source: node.id,
        target: targetId,
      }))
    )

    const svg = d3
      .select("#d3")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    // Create a group element to apply zoom
    const g = svg.append("g")

    // Apply zoom behavior to the SVG element
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.01, 4])
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr("transform", event.transform.toString())
      })

    svg.call(zoom as any)

    const simulation = d3
      .forceSimulation<NodeData>(nodes)
      .force(
        "link",
        d3
          .forceLink<NodeData, d3.SimulationLinkDatum<NodeData>>(links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))

    const link = g
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2)

    const node = g
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 8)
      .attr("fill", "#666")
      .call(drag(simulation) as any)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick)

    const label = g
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("font-weight", "bold")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("dy", "1.5em")
      .attr("x", 12)
      .attr("fill", "#fff")
      .text((d) => d.label)

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)

      label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)
    })

    function drag(simulation: d3.Simulation<NodeData, undefined>) {
      return d3
        .drag<SVGCircleElement, NodeData>()
        .on("start", (event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on("drag", (event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on("end", (event: d3.D3DragEvent<SVGCircleElement, NodeData, NodeData>, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
    }

    function handleMouseOver(event: MouseEvent, d: NodeData) {
      node.attr("fill", (n: NodeData) => (n.id === d.id ? "#7356ef" : "#ccc"))

      link.attr("stroke", (l: any) =>
        l.source.id === d.id || l.target.id === d.id ? "#7356ef" : "#ccc"
      )

      label.attr("fill", (n: NodeData) =>
        n.id === d.id ||
        links.some(
          (link: any) =>
            (link.source.id === d.id && link.target.id === n.id) ||
            (link.target.id === d.id && link.source.id === n.id)
        )
          ? "#fff"
          : "#4e4e4e"
      )

      node.attr("opacity", (n: NodeData) =>
        n.id === d.id ||
        links.some(
          (link: any) =>
            (link.source.id === d.id && link.target.id === n.id) ||
            (link.target.id === d.id && link.source.id === n.id)
        )
          ? 1
          : 0.2
      )
      link.attr("stroke-opacity", (l: any) =>
        l.source.id === d.id || l.target.id === d.id ? 1 : 0.2
      )
    }

    function handleMouseOut() {
      node.attr("fill", "#666").attr("opacity", 1)
      link.attr("stroke", "#999").attr("stroke-opacity", 0.6)
      label.attr("fill", "#fff").attr("opacity", 1)
    }

    function handleClick(event: MouseEvent, d: NodeData) {
      router.push(`/workspace/${currentlyWorking?._id}/doc/${d.id}`)
    }

    return () => {
      d3.select("#d3").selectAll("*").remove()
    }
  }, [nodes, currentlyWorking, router])

  return <div ref={containerRef} id="d3" className="w-full h-full"></div>
}

export default Graph