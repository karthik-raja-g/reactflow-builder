import { Handle, Position, useReactFlow } from "reactflow";
import { Node } from "./Node";

function NormalNode(props) {
  const { targetPosition, sourcePosition, id = "" } = props;
  return (
    <Node style={{ background: "red" }}>
      <Handle position={Position[targetPosition]} type="target" />
      {id.toUpperCase()}
      <Handle position={Position[sourcePosition]} type="source" />
    </Node>
  );
}

export default NormalNode;
