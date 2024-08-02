import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { connectionsReducer } from "./Redux/Reducers/ConnectionsReducer";
import { clientsReducer } from "./Redux/Reducers/ClientsReducer";
import { selectedIntegrationReducer } from "./Redux/Reducers/SelectedIntegrationReducer";

const rootReducer = combineReducers({
  connections: connectionsReducer,
  clients: clientsReducer,
  selectedIntegration: selectedIntegrationReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
