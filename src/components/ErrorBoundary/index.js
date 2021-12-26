import React from "react";
import { ErrorBoundary as EB } from "react-error-boundary";
import Button from "@mui/material/Button";

function ErrorBoundary(props) {
  return (
    <EB
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div>
          There was an error!
          <Button onClick={() => resetErrorBoundary()}>Try again</Button>
          <pre style={{ whiteSpace: "normal" }}>{error.message}</pre>
        </div>
      )}
    >
      {props.children}
    </EB>
  );
}

export default ErrorBoundary;
