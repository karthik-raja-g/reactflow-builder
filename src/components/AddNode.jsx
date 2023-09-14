import { Handle, Position } from "reactflow";
import { Node } from "./Node";
import { useState } from "react";
import styled from "styled-components";

const Options = styled.div`
  position: absolute;
  top: 25px;
  display: flex;
  flex-direction: column;
  background-color: black;
  padding: 15px;
`;

const Option = styled.div`
  color: white;
  font-size: 14px;
  padding: 0 5px;
  &:hover {
    border: 1px solid white;
  }
`;

function AddNode(props) {
  const { targetPosition, sourcePosition, id } = props;
  const [showOptions, setShowOptions] = useState(false);

  const handleAdd = (e) => {
    console.log({ tr: e.target });
    let detail = { id, type: "normal" };
    switch (e.target.dataset.op) {
      case "1": {
        detail.type = "normalNode";
        break;
      }
      case "2": {
        detail.type = "branchNode";
        break;
      }
      case "3": {
        detail.type = "endNode";
        break;
      }
    }
    dispatchEvent(new CustomEvent("add-node", { detail }));
  };
  return (
    <Node
      style={{ background: "blue", position: "relative" }}
      onClick={() => setShowOptions((p) => !p)}
    >
      <Handle position={Position[targetPosition]} type="target" />
      {id.toUpperCase()}
      {showOptions && (
        <Options>
          <Option onClick={handleAdd} data-op="1">
            Normal
          </Option>
          <Option onClick={handleAdd} data-op="2">
            Branch
          </Option>
          <Option onClick={handleAdd} data-op="3">
            End
          </Option>
        </Options>
      )}
      <Handle position={Position[sourcePosition]} type="source" />
    </Node>
  );
}

export default AddNode;
