import { useEffect, useState } from "react";
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

const addNodeCounter = (() => {
  let count = 0;
  return () => (count += 1);
})();

const newNodeCounter = (() => {
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
    type: "addNode",
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
  const nodeId = `add$${addNodeCounter()}`;
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
    dagreGraph.setNode(newNode.id);
    dagreGraph.setEdge(newEdge.source, newEdge.target);
    setNodes([...newNodes, newNode]);
    setEdges([...newEdges, newEdge]);
    // const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    //   [...newNodes, newNode],
    //   [...newEdges, newEdge]
    // );
    // console.log({layoutedNodes, layoutedEdges})
    // setNodes(layoutedNodes);
    // setEdges(layoutedEdges);
  };

  const listener = (info) => {
    const { id, type } = info.detail;
    const nodeInfo = dagreGraph.node(id);
    console.log({ nodeInfo });
    const inEdges = dagreGraph.inEdges(id);
    // construct the new node and edge
    const newNodeId = `node$${newNodeCounter()}`;
    const node = {
      id: newNodeId,
      type,
      position: {
        x: nodeInfo.x,
        y: nodeInfo.y,
      },
      sourcePosition: "Bottom",
      targetPosition: "Top",
    };
    const edge = {
      source: inEdges[0].v,
      target: newNodeId,
      id: `${inEdges[0].v}-${newNodeId}`,
      type: "smoothstep",
    };
    // update the existing node and edge with new ones
    dagreGraph.removeNode(id);
    dagreGraph.removeEdge(inEdges[0].v, inEdges[0].w);
    dagreGraph.setNode(node.id);
    dagreGraph.setEdge(inEdges[0].v, newNodeId);
    const filteredNodes = nodes.filter((node) => node.id !== id);
    const filteredEdges = edges.filter(
      (edge) => edge.id !== `${inEdges[0].v}-${id}`
    );

    console.log({ filteredEdges, filteredNodes });
    setNodes([...filteredNodes, node]);
    setEdges([...filteredEdges, edge]);
    // add a new addNode under the new node

    console.log(info);
    console.log({ nodes: dagreGraph.nodes(), edges: dagreGraph.edges() });
  };

  useEffect(() => {
    console.log({ nodes, edges });
  }, [nodes, edges]);

  useEffect(() => {
    window.addEventListener("add-node", listener);
    return () => window.removeEventListener("add-node", listener);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <button onClick={() => handleDelete("b")}>Delete</button>
      <ReactFlow nodeTypes={customNodes} edges={edges} nodes={nodes} fitView>
        <Background />
        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  );
};

export default Builder;
