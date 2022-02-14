import React, { useContext } from "react";
import { makeStyles } from "@mui/styles";
import Avatar from "@mui/material/Avatar";
import { UserContext } from "contexts/Providers/UserProvider";
import Typography from "@mui/material/Typography";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useTranslation } from "react-i18next";
import useFetch from "hooks/useFetch";
import Endpoints from "Endpoints";



const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  input: {
    display: "none",
  },
}));

function TopSide(props) {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const themeContext = useContext(ThemeContext);
  const { fetch } = useFetch();
  const { t } = useTranslation();
  const changeTheme = async () => {
    themeContext.toggleMuiType();
    try {
      await fetch({
        url: Endpoints.user.editProfile,
        data: {
          theme: themeContext.muiType === "light" ? "dark" : "light",
          //theme: "dark"
        },
        method: "PUT",
      });
    } catch (e) { }
  };
  return (
    <div className="topSide flex justify-between">
      <div className="flex">
        <div className="items-center flex">
          <Avatar
            className={classes.large}
            src={userContext.user.profileImageUrl &&
              process.env.REACT_APP_API_URL + "/public/" +
              userContext.user.profileImageUrl
            }
          ></Avatar>
        </div>
        <div className="flex flex-col justify-center ml-3">
          {userContext?.user?.firstname || userContext?.user?.lastname
            ?
            <>
              <Typography variant="h6" gutterBottom>
                {userContext?.user?.firstname} {userContext?.user?.lastname}
              </Typography>
              <Typography color="primary" variant="body1" gutterBottom>
                {userContext.user.email}
              </Typography>
            </>
            :
            <Typography variant="subtitle2" gutterBottom>
              {userContext.user.email}
            </Typography>
          }

        </div>
      </div>
      <div className="mt-5">
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={themeContext.muiType === "dark"}
              onChange={changeTheme}
            />
          }
          label={t(`theme.${themeContext.muiType}Theme`)}
        />
      </div>
    </div>
  );
}

export default TopSide;
