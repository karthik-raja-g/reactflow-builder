import { Handle, Position } from "reactflow";
import { Node } from "./Node";

function BranchNode(props) {
  const { targetPosition, sourcePosition } = props;
  return (
    <Node style={{ background: "yellow" }}>
      <Handle position={Position[targetPosition]} type="target" />
      B
      <Handle position={Position[sourcePosition]} type="source" />
    </Node>
  );
}

export default BranchNode;
