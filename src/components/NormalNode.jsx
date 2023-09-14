import { Handle, Position } from "reactflow";
import { Node } from "./Node";

function NormalNode(props) {
  console.log(props);
  const { targetPosition, sourcePosition } = props;
  return (
    <Node style={{ background: "red" }}>
      <Handle position={Position[targetPosition]} type="target" />
      A
      <Handle position={Position[sourcePosition]} type="source" />
    </Node>
  );
}

export default NormalNode;
