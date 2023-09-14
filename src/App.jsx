import "./App.css";
import 'reactflow/dist/style.css';
import { ReactFlowProvider} from "reactflow";
import Builder from "./Builder";
import EasyBuilder from "./EasyBuilder";

function App() {

  return (
    <ReactFlowProvider>
      {/* <Builder /> */}
      <EasyBuilder/>
    </ReactFlowProvider>
  );
}

export default App;
