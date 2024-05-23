import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AllRoutes } from "./AllRoutes";
import { ShopifyData } from "./Components/ClientsCom/ShopifyData";

function App() {
  return (
    <div className="App">
      <AllRoutes />
      {/* <ShopifyData /> */}
    </div>
  );
}

export default App;
