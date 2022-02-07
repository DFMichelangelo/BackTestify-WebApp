import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
function Home(props) {
  const history = useHistory();
  useEffect(() => {
    history.push("/p/backtester/input");
  }, []);
  return <></>;
}

export default Home;
