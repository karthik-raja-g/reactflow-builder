import { useState } from "react";
import BranchNode from "./components/BranchNode";
import AddNode from "./components/AddNode";
import NormalNode from "./components/NormalNode";
import ReactFlow, { Background, Controls } from "reactflow";
import dagre from "dagre";
const nodeWidth = 100;
const nodeHeight = 50;
const customNodes = {
  addNode: AddNode,
  normalNode: NormalNode,
  branchNode: BranchNode,
};

const initialNodes = [
  {
    id: "x",
    data: { label: "Hello" },
    type: "normalNode",
  },
  {
    id: "y",
    data: { label: "World" },
    type: "branchNode",
  },
];

const initialEdges = [
  { id: "1-2", source: "x", target: "y", label: "to the", type: "step" },
];

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);
  console.log({dagreGraph})
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "Left" : "Top";
    node.sourcePosition = isHorizontal ? "Right" : "Bottom";

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x,
      y: nodeWithPosition.y,
    };

    return node;
  });
//   dagreGraph.filterNodes(nd => console.log({nd})) 
//   console.log({ nodes, edges})
const xnode = dagreGraph.nodes();
const xedge = dagreGraph.hasNode()
console.log({xnode, xedge}) 
  return { nodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
);
const Builder = () => {
  const [nodes, setNodes] = useState(layoutedNodes);
  const [edges, setEdges] = useState(layoutedEdges);
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <ReactFlow nodeTypes={customNodes} edges={edges} nodes={nodes}>
        <Background />
        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  );
};

export default Builder;
