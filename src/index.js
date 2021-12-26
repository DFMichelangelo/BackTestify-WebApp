import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import "./index.css";
import "./sassStyles/main.scss";


ReactDOM.render(
  <App />
  ,
  document.getElementById("root")
);
serviceWorkerRegistration.register();