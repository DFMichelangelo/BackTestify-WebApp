// ? configurations of the frontend (names, functions, etc.)

const config = {
  mobileScreenWidth: "800px",
  name: {
    short: "BackTestify",
    long: "BackTestify",
    link: "https://www.linkedin.com/in/michelangelodefrancesco/",
  },
  palette: {
    primaryColor: "#729B79",
    secondaryColor: "#F3ff45",
  },
  theme: {
    roundLoader: {
      color: "#729B79",
    },
    forceTextColor: {
      //light: "#eaa",
      //dark: "#ada"
    },
    header: {
      enabled: true,
      color: "#729B79",
      shadow: true,
    },
    sidebar: {
      enabled: true,
      drawerWidth: 240,
      activeColor: "#729B79",
    },
    bottomNavigation: {
      enabled: false,
      showLabels: false,
      showOnDesktop: true,
      activeColor: "#729B79",
    },
  },
};
export default config;
