import React, { useContext, useState } from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import "./style.scss";
import useFetch from "hooks/useFetch";
import Endpoints from "Endpoints";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

function DisableAccountBox(props) {
    const { t } = useTranslation();
    const { fetch } = useFetch();
    const [disabledFields, setDisabledFields] = useState(true);
    const history = useHistory();
    const themeContext = useContext(ThemeContext);
    let [showPassword, setShowPassword] = useState(false);
    const validationSchema = Yup.object({
        password: Yup.string().required().min(1),
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const formikDisableUser = useFormik({
        initialValues: {
            password: ""
        },
        validationSchema,
        validate: (values) => {
            validationSchema.isValid(values).then((e) => setDisabledFields(!e));
        },
        onSubmit: async (values) => {
            try {
                await fetch({
                    url: Endpoints.user.disableAccount,
                    data: {
                        password: values.password
                    },
                    method: "DELETE",
                });
                await fetch({
                    url: Endpoints.auth.logout,
                    method: "DELETE"
                })
                history.push("/auth/login");

            } catch (e) {
                if (e.status === 401 && e.data.message === "Password is wrong") themeContext.showErrorSnackbar({ message: "profile.passwordInsertedIsWrong" });
            }
        },
    });

    return (
        <Card id="disableAccount">
            <form onSubmit={formikDisableUser.handleSubmit}>
                <CardHeader title={t("profile.disableAccount")} />

                <CardContent>
                    <div className="flex flex-col">
                        <TextField
                            error={
                                formikDisableUser.touched.password &&
                                Boolean(formikDisableUser.errors.password)
                            }
                            variant="filled"
                            id="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            onChange={formikDisableUser.handleChange}
                            onBlur={formikDisableUser.handleBlur}
                            value={formikDisableUser.values.password}
                            helperText={
                                formikDisableUser.touched.password &&
                                t(formikDisableUser.errors.password)
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? (
                                                <VisibilityOutlinedIcon />
                                            ) : (
                                                <VisibilityOffOutlinedIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </CardContent>

                <CardActions>
                    <Button
                        disabled={disabledFields}
                        color="primary"
                        type="submit"
                    >
                        {t("profile.disable")}
                    </Button>
                </CardActions>
            </form>
        </Card >
    );
}

export default DisableAccountBox;
