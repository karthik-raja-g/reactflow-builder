// export const initialNodes = [
//     {
//       id: "x",
//       data: { label: "Hello" },
//       type: "normalNode",
//     },
//     {
//       id: "y",
//       data: { label: "World" },
//       type: "branchNode",
//     },
//     {
//       id: "a",
//       data: { label: "World" },
//       type: "addNode",
//     },
//     {
//       id: "b",
//       data: { label: "World" },
//       type: "branchNode",
//     },
//     {
//       id: "c",
//       data: { label: "World" },
//       type: "normalNode",
//     },
//     {
//       id: "d",
//       data: { label: "World" },
//       type: "addNode",
//     },
//   ];
  
//   export const initialEdges = [
//     { id: "x-y", source: "x", target: "y", label: "to the", type: "smoothstep" },
//     { id: "y-a", source: "y", target: "a", label: "to the", type: "smoothstep" },
//     { id: "y-b", source: "y", target: "b", label: "to the", type: "smoothstep" },
//     { id: "b-c", source: "b", target: "c", label: "to the", type: "smoothstep" },
//     { id: "b-d", source: "b", target: "d", label: "to the", type: "smoothstep" },
//   ];
export const initialNodes = [
    { id: '1', data: { label: '-' }, position: { x: 0, y: 0 }, type: "normalNode" },
    { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 }, type: "normalNode" },
  ];
  
export const initialEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'smoothstep' }];