import React from "react";

// ? import all the contexts
import ThemeProvider from "./Providers/ThemeProvider";
import UserProvider from "./Providers/UserProvider";
import BacktesterProvider from "./Providers/BacktesterProvider";
function Provider(props) {
  return (
    <ThemeProvider>
      <UserProvider>
        <BacktesterProvider>
          {props.children}
        </BacktesterProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default Provider;
