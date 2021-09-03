// import { StatusBar } from "expo-status-bar";
import React from "react";
import { allReducer } from "./src/redux/reducer/index";
import { Provider } from "react-redux";
import { createStore } from "redux";
import Main from "./src/compo/Main";

const myStore = createStore(allReducer);

export default function App() {
  return (
    <Provider store={myStore}>
      <Main />
    </Provider>
  );
}
