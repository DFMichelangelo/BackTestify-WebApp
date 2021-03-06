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


serviceWorkerRegistration.register({
  onUpdate: function (registration) {
    console.log("I am in the onUpdate function");
    let appUpdateEvent = new Event('app-update');
    window.dispatchEvent(appUpdateEvent);
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  },
  onSuccess: function (registration) {
    console.log("I am in the onSuccess function");
    let appUpdateEvent = new Event('app-update');
    window.dispatchEvent(appUpdateEvent);
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  }
}
);