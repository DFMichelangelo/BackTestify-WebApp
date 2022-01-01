import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import Brightness3OutlinedIcon from "@mui/icons-material/Brightness3Outlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import config from "configuration/config";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { UserContext } from "contexts/Providers/UserProvider";
import Endpoints from "Endpoints";
import useFetch from "hooks/useFetch";
import React, { useContext, useState } from "react";
import { Trans } from "react-i18next";
import { useHistory } from "react-router-dom";
import Feedback from "theme/Header/Feedback";
import InstallPWAButton from "theme/Header/InstallPWAButton";
import "./style.scss";
function ProfileButton(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const themeContext = useContext(ThemeContext);
  const userContext = useContext(UserContext);
  const history = useHistory();
  const matches = useMediaQuery("(max-width:" + config.mobileScreenWidth + ")");
  const { fetch } = useFetch();
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div className="profileButton flex-grow flex justify-end">
      <Tooltip title={<Trans>profileButton.profile</Trans>}>
        <Button
          color="inherit"
          id="avatarButton"
          onClick={handleClick}
        >
          <Avatar
            sx={{ width: 32, height: 32 }}
            src={userContext?.user?.profileImageUrl &&
              process.env.REACT_APP_API_URL + "/public/" +
              userContext.user.profileImageUrl
            }
          ></Avatar>
          {!matches && (
            <span className="ml-2">
              <Typography variant="body2">
                {userContext?.user?.firstname || (
                  <Trans>profileButton.welcome</Trans>
                )}
              </Typography>
            </span>
          )}
          {anchorEl ? (
            <ArrowDropUpOutlinedIcon fontSize="small" className="dropIcon" />
          ) : (
            <ArrowDropDownOutlinedIcon fontSize="small" className="dropIcon" />
          )}
        </Button>
      </Tooltip>

      <Menu
        elevation={2}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        id="profileMenu"
      >
        <MenuItem
          disabled={Boolean(!userContext?.user)}
          onClick={() => {
            history.push("/account/profile");
            setAnchorEl(false);
          }}
          dense={true}
        >
          <span className="menuItem">
            <PersonOutlineOutlinedIcon
              className="menuProfileIcon"
              color="action"
              fontSize="small"
            />
            <Typography color="textSecondary" variant="body2">
              <Trans>profileButton.profile</Trans>
            </Typography>
          </span>
        </MenuItem>
        <MenuItem onClick={themeContext.toggleMuiType} dense={true}>
          <span className="menuItem">
            {themeContext.muiType === "light" ? (
              <WbSunnyOutlinedIcon
                className="menuProfileIcon"
                color="action"
                fontSize="small"
              />
            ) : (
              <Brightness3OutlinedIcon
                className="menuProfileIcon"
                color="action"
                fontSize="small"
              />
            )}
            <Typography color="textSecondary" variant="body2">
              <Trans>profileButton.changeTheme</Trans>
            </Typography>
          </span>
        </MenuItem>
        <Feedback disabled={Boolean(!userContext?.user)} closeMenu={() => setAnchorEl(false)} />
        <InstallPWAButton />

        <Divider variant="middle" />
        {userContext?.user && <MenuItem
          onClick={async () => {
            try {
              await fetch({
                url: Endpoints.auth.logout,
                method: "DELETE",
              });
              history.push("/auth/login");
              userContext.setUser(undefined);
            } catch (e) { }
          }}
          dense={true}
        >
          <span className="menuItem">
            <ExitToAppOutlinedIcon
              className="menuProfileIcon"
              color="action"
              fontSize="small"
            />
            <Typography color="textSecondary" variant="body2">
              <Trans>auth.logout</Trans>
            </Typography>
          </span>
        </MenuItem>}

        {!userContext?.user && <MenuItem
          onClick={() => history.push("/auth/login")}
          dense={true}
        >
          <span className="menuItem">
            <LoginOutlinedIcon
              className="menuProfileIcon"
              color="action"
              fontSize="small"
            />
            <Typography color="textSecondary" variant="body2">
              <Trans>auth.login</Trans>
            </Typography>
          </span>
        </MenuItem>}

      </Menu>
    </div>
  );
}
export default ProfileButton;
