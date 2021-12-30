import React, { useEffect } from "react";
import "./style.scss";
import RoundLoader from "components/RoundLoader";
import PublicAppBar from "components/PublicAppBar";
import config from "configuration/config";
import Helmet from "react-helmet";
import useFetch from "hooks/useFetch"
import Endpoints from "Endpoints"
function PrivacyPolicy(props) {
  const { fetch, data, loading } = useFetch()
  const loadData = async () => {
    await fetch({
      method: "GET",
      name: "privacyPolicy",
      url: Endpoints.tos.getPrivacyPolicy,
    })
  }
  useEffect(() => { loadData() }, [])
  if (loading) return <RoundLoader />
  return (
    <PublicAppBar title="Privacy Policy">
      <Helmet title={`${config.name.short} - Privacy Policy`} />
      <div id="privacyPolicy">
        {data?.value && <div dangerouslySetInnerHTML={{ __html: data?.value }} className='documentation-content' />}
      </div>
    </PublicAppBar>
  );
}

export default PrivacyPolicy;
