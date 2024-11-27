import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { thunk } from "redux-thunk"; // Change this line
import { connectionsReducer } from "./Redux/Reducers/ConnectionsReducer";
import { clientsReducer } from "./Redux/Reducers/ClientsReducer";
import { selectedIntegrationReducer } from "./Redux/Reducers/SelectedIntegrationReducer";
import { eshipperReducer } from "./Redux/Reducers/EShipperReducer";
import { summaryReducer } from "./Redux/Reducers/SummaryActions";
import { logsReducer } from "./Redux/Reducers/LoggerReducer";

const rootReducer = combineReducers({
  connections: connectionsReducer,
  clients: clientsReducer,
  selectedIntegration: selectedIntegrationReducer,
  eshipper: eshipperReducer,
  summary: summaryReducer,
  logs: logsReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
