import { useCallback, useEffect, useReducer } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import AddNode from "./components/AddNode";
import NormalNode from "./components/NormalNode";
import BranchNode from "./components/BranchNode";
import styled from "styled-components";
import { initialEdges, initialNodes } from "./data";
import dagre from "dagre";

const initialState = {
  nodes: initialNodes,
  edges: initialEdges,
};
function reducer(state, action) {
  switch (action.type) {
    case "ADD_NODE": {
      return {
        ...state,
        nodes: [...state.nodes, action.payload],
      };
    }
    case "ADD_EDGE": {
      break;
    }
    case "DELETE_NODE": {
      break;
    }
    case "DELETE_EDGE": {
      break;
    }
    case "UPDATE_NODE": {
      break;
    }
    case "UPDATE_EDGE": {
      break;
    }
  }
}

const nodeWidth = 100;
const nodeHeight = 50;
const customNodes = {
  addNode: AddNode,
  normalNode: NormalNode,
  branchNode: BranchNode,
};

const Dasboard = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;
  flex-grow: 1;
`;

const ActionPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const Builder = styled.div`
  flex-grow: 1;
  border: 1px solid red;
`;

const newNodeCounter = (() => {
  let count = 0;
  return () => {
    count += 1;
    return `node-${count}`;
  };
})();

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
  const nds = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const targetPosition = isHorizontal ? "Left" : "Top";
    const sourcePosition = isHorizontal ? "Right" : "Bottom";

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    const position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return { ...node, targetPosition, sourcePosition, position };
  });
  return { nodes: nds, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
);

export default function EasyBuilder() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  //   useEffect(() => {
  //     setNodes(state.nodes);
  //   }, [state.nodes]);

  //   useEffect(() => {
  //     setEdges(state.edges);
  //   }, [state.edges, setEdges]);

  useEffect(() => {
    const interval = setTimeout(() => {
      console.log(nodes);
    }, 1000);
    return () => {
      clearTimeout(interval);
    };
  }, [nodes]);

  const addNode = () => {
    setNodes([
      ...nodes,
      {
        id: newNodeCounter(),
        position: { x: -63.5, y: 259.5 },
        type: "normalNode",
      },
    ]);
    // dispatch({
    //   type: "ADD_NODE",
    //   payload: {
    //     id: newNodeCounter(),
    //     position: {x: -63.5, y: 259.5},
    //   },
    // });
  };

  const straight = () => {
    const { nodes: nds, edges: eds } = getLayoutedElements(nodes, edges, "TB");
    console.log({ nds, eds });
    setEdges(edges.map((edge) => ({ ...edge, type: "smoothstep" })));
    setNodes(nds);
    // setEdges(eds);
  };
  return (
    <Dasboard>
      <ActionPanel>
        <button onClick={addNode}>Add node</button>
        <button onClick={straight}>Straighten</button>
      </ActionPanel>
      <Builder>
        <ReactFlow
          nodeTypes={customNodes}
          edges={edges}
          nodes={nodes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          edgeTypes={["smoothstep"]}
          fitView
        >
          <Background />
          <Controls position="bottom-right" />
        </ReactFlow>
      </Builder>
    </Dasboard>
  );
}

{
  /* <ReactFlow
        nodeTypes={customNodes}
        edges={edges}
        nodes={nodes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls position="bottom-right" />
      </ReactFlow> */
}
