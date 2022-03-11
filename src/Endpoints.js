let Endpoints = {
  auth: {
    signup: "/v1/auth/signup", // ? POST
    login: "/v1/auth/login", // ? POST
    activation: "/v1/auth/activation/:activationCode", // ? POST
    lostPasswordEmail: "/v1/auth/lost-password-mail", // ? POST
    passwordReset: "/v1/auth/password-reset", // ? POST
    newAccessToken: "/v1/auth/token", // ? POST
    logout: "/v1/auth/logout", // ? DELETE
    token: "/v1/auth/token", // ? POST
  },
  user: {
    profile: "/v1/app/user/info", // ? GET
    editProfile: "/v1/app/user/edit", // ? GET
    disableAccount: "v1/app/user/disable" // ? DELETE
  },
  debug: {
    status: "/v1/debug/status/:status", // ? GET
  },
  feedback: {
    sendNew: "/v1/app/feedback/create", // ? POST
  },
  tos: {
    getPrivacyPolicy: "/v1/app/gdpr/privacy-policy",
    getTermsAndConditions: "/v1/app/gdpr/terms-and-conditions"
  },
  backtester: {
    getStrategies: "/get_strategies", // ? GET
    backtestStrategy: "/backtest_strategy", // ? POST
    saveBacktest: "/backtest", // ? POST
    getAllBacktests: "/backtest/all", // ? GET
  }
}

/*
let Endpoints = [
  {
    url: process.env.REACT_APP_API_URL,
    routes: {
      auth: {
        signup: "/v1/auth/signup", // ? POST
        login: "/v1/auth/login", // ? POST
        activation: "/v1/auth/activation/:activationCode", // ? POST
        lostPasswordEmail: "/v1/auth/lost-password-mail", // ? POST
        passwordReset: "/v1/auth/password-reset", // ? POST
        newAccessToken: "/v1/auth/token", // ? POST
        logout: "/v1/auth/logout", // ? DELETE
        token: "/v1/auth/token", // ? POST
      },
      user: {
        profile: "/v1/app/user/info", // ? GET
        editProfile: "/v1/app/user/edit", // ? GET
        disableAccount: "v1/app/user/disable" // ? DELETE
      },
      debug: {
        status: "/v1/debug/status/:status", // ? GET
      },
      feedback: {
        sendNew: "/v1/app/feedback/create", // ? POST
      },

      tos: {
        getPrivacyPolicy: "/v1/app/gdpr/privacy-policy",
        getTermsAndConditions: "/v1/app/gdpr/terms-and-conditions"
      },
    }
  },
  {
    url: process.env.REACT_APP_BACKTESTER_ENGINE_URL,
    routes: {
      backtester: {
        getStrategies: "/getStrategies" // ? GET
      }
    }
  }
];
export function createEndpoints() {
  const addUrl = (obj, url) => {
    for (const property in obj) {
      if (typeof obj[property] == "string") obj[property] = url + obj[property];
      else addUrl(obj[property], url);
    }
    return obj
  }
  let EndpointsJ = {};
  Endpoints.map(endpoint => EndpointsJ = { ...EndpointsJ, ...addUrl(endpoint.routes, endpoint.url) });
  Endpoints = EndpointsJ
}
*/
export default Endpoints;
