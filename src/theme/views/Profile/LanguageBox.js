import React, { useContext } from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import "./style.scss";
import MenuItem from "@mui/material/MenuItem";
import i18next from "i18next";
import Select from "@mui/material/Select";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import useFetch from "hooks/useFetch";
import Endpoints from "Endpoints";
import { useTranslation } from "react-i18next";

function LanguageBox(props) {
  const themeContext = useContext(ThemeContext);
  const { fetch } = useFetch();
  const { t } = useTranslation();
  const changeLanguage = (e) => {
    i18next.changeLanguage(e.target.value, async (err, t) => {
      if (err)
        themeContext.showErrorSnackbar({
          message: t("somethingWentWrong"),
        });
      else {
        try {
          themeContext.setI18nextLng(e.target.value);
          await fetch({
            url: Endpoints.user.editProfile,
            data: {
              language: e.target.value,
            },
            method: "PUT",
          });
        } catch (e) { }
      }
    });
  };

  return (
    <Card id="languageBox">
      <CardHeader title={t("profile.language")} />
      <CardContent className="flex flex-col">
        <div>
          {t("profile.preferredLanguageText")}
        </div>
        <div className="mt-3 flex justify-center">
          <Select
            variant="outlined"
            id="languageSelect"
            value={localStorage.getItem("i18nextLng")}
            onChange={changeLanguage}
          >
            <MenuItem value={"it-IT"}>Italiano</MenuItem>
            <MenuItem value={"en-EN"}>English</MenuItem>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

export default LanguageBox;
