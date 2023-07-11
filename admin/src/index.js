import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthContextProvider } from "./context/AuthContext";
import { ViewUserContextProvider } from "./context/ViewUserContext";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ViewUserContextProvider>
        <DarkModeContextProvider>
          <App />
        </DarkModeContextProvider>
      </ViewUserContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
