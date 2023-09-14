import { Handle, Position } from "reactflow";
import { Node } from "./Node";

function BranchNode(props) {
  const { targetPosition, sourcePosition, id } = props;

  return (
    <Node style={{ background: "yellow" }}>
      <Handle position={Position[targetPosition]} type="target" />
      {id.toUpperCase()}
      <Handle position={Position[sourcePosition]} type="source" />
    </Node>
  );
}

export default BranchNode;
