import React, {
  lazy,
  useEffect,
  useCallback,
  useContext,
  useState,
  Suspense,
} from "react";
import { Route, Switch } from "react-router-dom";
import Account from "./Account";
import { UserContext } from "contexts/Providers/UserProvider";
import Endpoints from "Endpoints";
import RoundLoader from "components/RoundLoader";
import { useHistory } from "react-router-dom";
import useFetch from "hooks/useFetch";
const ErrorNotFound = lazy(() => import("theme/views/Placeholders/ErrorNotFound"));
const Home = lazy(() => import("theme/views/Home"));

function App(props) {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { fetch } = useFetch();

  useEffect(() => {
    checkUserIdentity();
  }, []);

  const checkUserIdentity = useCallback(async () => {
    if (userContext.user) {
      setLoading(false);
      return;
    }
    // ? qui non ho l'utente
    try {
      const data = await fetch({
        method: "GET",
        url: Endpoints.user.profile,
        redirectToPage500: true,
      });
      userContext.setUser(data);
      setLoading(false);
    } catch (e) {
      if (e?.status === 404) {
        history.push("auth/login?returnUrl=" + history.location.pathname);
        //themeContext.showWarningSnackbar({ message: "loginAgain" })
      }
      //history.push("auth?returnUrl=" + history.location.pathname)
    }
  }, []);

  if (loading) return <RoundLoader />;
  return (
    <Suspense fallback={<RoundLoader />}>
      <Switch>
        <Route path="/account*" exact component={Account} />
        <Route exact path="/" component={Home} />
        <Route component={ErrorNotFound} />
      </Switch>
    </Suspense>
  );
}

export default App;
