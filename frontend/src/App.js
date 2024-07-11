import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AllRoutes } from "./AllRoutes";
import { ShopifyData } from "./Components/ClientsCom/ShopifyData";
import { Orders } from "./Components/Connections/Webhook/Orders";

function App() {
  return (
    <div className="App">
      {/* <Orders /> */}
      <AllRoutes />
      {/* <ShopifyData /> */}
    </div>
  );
}

export default App;
