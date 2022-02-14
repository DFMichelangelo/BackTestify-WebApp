import React, { useContext, useState } from "react";
import { UserContext } from "contexts/Providers/UserProvider";
import { Card, CardContent, CardHeader } from "@mui/material";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import "./style.scss";
import useFetch from "hooks/useFetch";
import Endpoints from "Endpoints";
import { useFormik } from "formik";

function ProfileBox(props) {
  const userContext = useContext(UserContext);
  const { fetch } = useFetch();
  const [disabledFields, setDisabledFields] = useState(true);
  const { t } = useTranslation();
  const formikProfile = useFormik({
    initialValues: {
      firstname: userContext.user.firstname,
      lastname: userContext.user.lastname,
      email: userContext.user.email,
    },
    onSubmit: async (values) => {
      try {
        const newInformations = await fetch({
          url: Endpoints.user.editProfile,
          data: {
            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
          },
          method: "PUT",
        });
        userContext.setUser(newInformations);
      } catch (e) { }
    },
  });

  return (
    <Card id="personalInformationBox">
      <form onSubmit={formikProfile.handleSubmit}>
        <CardHeader title={t("profile.personalInformation")} />

        <CardContent>
          <div id="personalInformationData" className="flex flex-col">
            <TextField
              disabled={disabledFields}
              id="firstname"
              label={t("profile.firstname")}
              variant="filled"
              onChange={formikProfile.handleChange}
              value={formikProfile.values?.firstname}
            />

            <TextField
              disabled={disabledFields}
              id="lastname"
              label={t("profile.lastname")}
              variant="filled"
              onChange={formikProfile.handleChange}
              value={formikProfile.values?.lastname}
            />
            <TextField
              disabled={disabledFields}
              id="email"
              label="Email"
              variant="filled"
              onChange={formikProfile.handleChange}
              value={formikProfile.values.email}
            />
          </div>
        </CardContent>

        <CardActions>
          {disabledFields && (
            <Button
              color="primary"
              onClick={() => {
                setDisabledFields(false);
              }}
            >
              {t("profile.changePersonalInformation")}
            </Button>
          )}

          {!disabledFields && (
            <span>
              <Button
                //type="submit"
                color="primary"
                onClick={() => {
                  formikProfile.handleSubmit();
                  //formikProfile.resetForm()
                  setDisabledFields(true);
                }}
              >
                {t("save")}
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  formikProfile.resetForm();
                  setDisabledFields(true);
                }}
              >
                {t("profile.cancel")}
              </Button>
            </span>
          )}
        </CardActions>
      </form>
    </Card>
  );
}

export default ProfileBox;
