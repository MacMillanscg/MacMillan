import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { connectionsReducer } from "./Redux/Reducers/ConnectionsReducer";

const rootReducer = combineReducers({
  connections: connectionsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
