import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FamilyMember } from '../../types/FamilyMember';

interface FamilyTreeVisualizationProps {
  data: any;
  onSelectMember: (member: FamilyMember) => void;
}

const FamilyTreeVisualization = ({ data, onSelectMember }: FamilyTreeVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 800;
    const height = 600;
    const nodeWidth = 120;
    const nodeHeight = 60;

    // Clear existing content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create tree layout
    const treeLayout = d3.tree()
      .nodeSize([nodeWidth, nodeHeight])
      .separation((a, b) => a.parent === b.parent ? 1.5 : 2);

    // Create hierarchy from data
    const root = d3.hierarchy(data);
    const tree = treeLayout(root);

    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},50)`);

    // Add links
    svg.selectAll("path")
      .data(tree.links())
      .enter()
      .append("path")
      .attr("d", d3.linkVertical()
        .x((d: any) => d.x)
        .y((d: any) => d.y))
      .attr("fill", "none")
      .attr("stroke", "#ccc");

    // Add nodes
    const nodes = svg.selectAll("g.node")
      .data(tree.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Add node rectangles
    nodes.append("rect")
      .attr("x", -nodeWidth / 2)
      .attr("y", -nodeHeight / 2)
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "white")
      .attr("stroke", "#00afaf")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        onSelectMember(d.data);
      });

    // Add node text
    nodes.append("text")
      .attr("dy", "0.3em")
      .attr("text-anchor", "middle")
      .text(d => d.data.name)
      .style("font-size", "12px")
      .style("pointer-events", "none");

  }, [data, onSelectMember]);

  return (
    <div className="overflow-auto">
      <svg
        ref={svgRef}
        className="mx-auto"
        style={{ minWidth: '800px', minHeight: '600px' }}
      />
    </div>
  );
};

export default FamilyTreeVisualization;