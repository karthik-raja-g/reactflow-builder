import "./App.css";
import 'reactflow/dist/style.css';
import { ReactFlowProvider} from "reactflow";
import Builder from "./Builder";

function App() {

  return (
    <ReactFlowProvider>
      <Builder />
    </ReactFlowProvider>
  );
}

export default App;
