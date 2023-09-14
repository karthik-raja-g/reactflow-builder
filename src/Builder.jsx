import { useEffect, useState } from "react";
import BranchNode from "./components/BranchNode";
import AddNode from "./components/AddNode";
import NormalNode from "./components/NormalNode";
import ReactFlow, { Background, Controls, useReactFlow } from "reactflow";
import dagre from "dagre";
const nodeWidth = 100;
const nodeHeight = 50;
const customNodes = {
  addNode: AddNode,
  normalNode: NormalNode,
  branchNode: BranchNode,
};

const counter = (() => {
  let count = 0;
  return () => (count += 1);
})();

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
  {
    id: "a",
    data: { label: "World" },
    type: "addNode",
  },
  {
    id: "b",
    data: { label: "World" },
    type: "branchNode",
  },
  {
    id: "c",
    data: { label: "World" },
    type: "normalNode",
  },
  {
    id: "d",
    data: { label: "World" },
    type: "normalNode",
  },
];

const initialEdges = [
  { id: "x-y", source: "x", target: "y", label: "to the", type: "smoothstep" },
  { id: "y-a", source: "y", target: "a", label: "to the", type: "smoothstep" },
  { id: "y-b", source: "y", target: "b", label: "to the", type: "smoothstep" },
  { id: "b-c", source: "b", target: "c", label: "to the", type: "smoothstep" },
  { id: "b-d", source: "b", target: "d", label: "to the", type: "smoothstep" },
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
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? "Left" : "Top";
    node.sourcePosition = isHorizontal ? "Right" : "Bottom";

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });
  return { nodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
);

function replaceWithAddNode(node) {
  const inEdges = dagreGraph.inEdges(node);
  const nodeInfo = dagreGraph.node(node);
  const nodeId = `add$${counter()}`;
  const newNode = {
    id: nodeId,
    type: "addNode",
    position: {
      x: nodeInfo.x,
      y: nodeInfo.y,
    },
  };
  const newEdge = {
    source: inEdges[0].v,
    target: nodeId,
    type: "smoothstep",
    id: `${inEdges[0].v}-${nodeId}`,
  };
  return { newNode, newEdge };
}

function removeAllChildren(node) {
  const successors = dagreGraph.successors(node);
  if (!successors?.length) {
    // is leaf node. remove it
    dagreGraph.removeNode(node);
    return dagreGraph;
  }
  // remove all chilren recursively
  successors.forEach((node) => removeAllChildren(node));
  // then remove the node
  dagreGraph.removeNode(node);
  return dagreGraph;
}
const Builder = () => {
  const [nodes, setNodes] = useState(layoutedNodes);
  const [edges, setEdges] = useState(layoutedEdges);
  const ctx = useReactFlow();
  const handleDelete = (id) => {
    const { newNode, newEdge } = replaceWithAddNode(id);
    const res = removeAllChildren(id);
    // console.log({
    //   neig: dagreGraph.neighbors(id),
    //   succ: dagreGraph.successors(id),
    //   prd: dagreGraph.predecessors(id)
    // })
    // return;
    const newNodes = res.nodes().map((nd) => {
      const old = nodes.find((node) => node.id === nd);
      const newNode = dagreGraph.node(nd);
      return {
        ...old,
        position: {
          x: newNode.x,
          y: newNode.y,
        },
      };
    });
    const newEdges = res.edges().map(({ v, w }) => {
      const oldEdge = edges.find((edge) => edge.id == `${v}-${w}`);
      return oldEdge;
    });
    console.log({ newNodes, newEdges });
    console.log({ nd: res.nodes(), ed: res.edges(), edc: res.edgeCount() });
    // setNodes(newNodes);
    // setEdges(newEdges);
    setNodes([...newNodes, newNode]);
    setEdges([...newEdges, newEdge]);
    // console.log({ nodes: dagreGraph.node("b"), src: dagreGraph.sinks() });
  };

  const handleAdd = () => {
    ctx.addNodes({ id: "test", data: { label: "World" }, type: "normalNode" });
    ctx.addEdges({ source: "a", target: "c" });
  };

  const listener = (info) => {
    console.log(info);
  };

  useEffect(() => {
    console.log({nodes, edges})
  },[nodes,edges])
  useEffect(() => {
    window.addEventListener("add-node", listener);
    return () => window.removeEventListener("add-node", listener);
  }, []);
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <button onClick={() => handleDelete("c")}>Delete</button>
      <ReactFlow nodeTypes={customNodes} edges={edges} nodes={nodes} fitView>
        <Background />
        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  );
};

export default Builder;
