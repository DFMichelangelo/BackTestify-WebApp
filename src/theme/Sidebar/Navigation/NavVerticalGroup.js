import React, { useContext } from "react";
import NavVerticalCollapse from "./NavVerticalCollapse";
import NavVerticalItem from "./NavVerticalItem";
import { ListSubheader } from "@mui/material";
import classNames from "classnames";
import PropTypes from "prop-types";
import config from "configuration/config";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { makeStyles } from "@mui/styles";
import Skeleton from '@mui/material/Skeleton';
import classnames from "classnames";
import { styled } from '@mui/material/styles';
import useMediaQuery from "@mui/material/useMediaQuery";
import "./style.scss"

const useStyles = makeStyles((theme) => ({
  uppercaseText: {
    textTransform: "uppercase",
  },
}));


const Title = styled("div", { shouldForwardProp: (prop) => prop !== 'openSB' & prop !== "matches" })(
  ({ theme, openSB, matches }) => ({
    opacity: 0,
    position: "absolute",
    ...(openSB && {
      opacity: 1,
      transition: theme.transitions.create(["opacity"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen * 3,
      }),
    }),
    //...(!openSB && {
    //  opacity: 0,
    //  transition: theme.transitions.create(["opacity"], {
    //    easing: theme.transitions.easing.sharp,
    //    duration: theme.transitions.duration.leavingScreen * 3,
    //  }),
    //}),
  }),
);


const SkeletonWrapper = styled("div", { shouldForwardProp: (prop) => prop !== 'openSB' & prop !== "matches" })(
  ({ theme, openSB, matches }) => ({
    marginLeft: 16,
    ...(openSB && {
      opacity: 0,
    }),
    ...(!openSB && {
      opacity: 1,
      transition: theme.transitions.create(["opacity"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen * 3,
      }),
    }),
  }),
);


function NavVerticalGroup(props) {
  const { item, nestedLevel } = props;
  const classes = useStyles();
  const themeContext = useContext(ThemeContext);
  const { t } = useTranslation();
  const matches = useMediaQuery("(max-width:" + config.mobileScreenWidth + ")");

  let paddingValue = nestedLevel * 3;

  const listItemPadding =
    nestedLevel > 0 ? "pl-" + (paddingValue > 80 ? 80 : paddingValue) : "";
  return (
    <>
      <div className="wrapperTitle relative">
        <Title
          openSB={themeContext.sidebarOpen ? 1 : 0}
          matches={matches ? 1 : 0}>
          <ListSubheader disableSticky={true}>
            <span className={classnames(classes.uppercaseText)}>
              <Typography variant="body2">
                <span className={classNames(listItemPadding)}>
                  {t(item.id)}
                </span>
              </Typography>
            </span>
          </ListSubheader>
        </Title>
        <SkeletonWrapper
          openSB={themeContext.sidebarOpen ? 1 : 0}
          matches={matches ? 1 : 0}
        >
          <Typography variant="body2" align="center">
            <Skeleton animation={false} width={40} />
          </Typography>
        </SkeletonWrapper>

      </div>
      {item.children && (
        <>
          {item.children.map((item) => (
            <React.Fragment key={item.id}>
              {item.type === "group" && (
                <NavVerticalGroup item={item} nestedLevel={nestedLevel + 1} />
              )}

              {item.type === "collapse" && (
                <NavVerticalCollapse
                  item={item}
                  nestedLevel={nestedLevel + 1}
                />
              )}

              {item.type === "item" && (
                <NavVerticalItem item={item} nestedLevel={nestedLevel} />
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
}

NavVerticalGroup.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    isAuthorized: PropTypes.func,
    profiles: PropTypes.array,
    children: PropTypes.array,
  }),
};
NavVerticalGroup.defaultProps = {};

export default NavVerticalGroup;
