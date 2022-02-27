import React, { useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import "sassStyles/placeholders.scss";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import Typography from "@mui/material/Typography";
function DesktopOnly(props) {
    const themeContext = useContext(ThemeContext);

    const { t } = useTranslation();
    useEffect(() => {
        themeContext.setTitle("placeholder.desktopOnly");
    }, []);

    return (
        <div className="error-page placeholder desktop-only">
            <img
                width="250px"
                src="/img/placeholders/desktopOnly.svg"
                alt="Desktop Only"
                className="error-image"
            />
            <Typography variant="h5" gutterBottom className="error-text">
                {t("placeholder.desktopOnly")}
            </Typography>
        </div>
    );
}

export default DesktopOnly;
