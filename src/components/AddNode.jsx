import { Handle, Position } from "reactflow";
import { Node } from "./Node";

function AddNode() {
  return (
    <Node style={{background: 'blue'}}>
      {/* <Handle position={Position.Top} type="target" /> */}
      A
      {/* <Handle position={Position.Bottom} type="source" /> */}
    </Node>
  );
}

export default AddNode
