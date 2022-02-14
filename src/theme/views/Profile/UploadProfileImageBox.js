import React, { useContext, useState } from "react";
import { UserContext } from "contexts/Providers/UserProvider";
import { Card, CardContent, CardHeader, Button, CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Typography from "@mui/material/Typography";
import "./style.scss";
import { makeStyles } from "@mui/styles";
import Avatar from "@mui/material/Avatar";
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

function UploadProfileImageBox(props) {
  const [uploaderLoader, setUploaderLoader] = useState(false)
  const userContext = useContext(UserContext);
  const classes = useStyles();
  const { fetch } = useFetch();
  const { t } = useTranslation();

  const handleUploadClick = (event) => {
    if (event?.target?.files[0]) {
      let file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async function (e) {
        setUploaderLoader(true)
        let result = await fetch({
          url: Endpoints.user.editProfile,
          method: "PUT",
          file,
          filename: "profileImageUrl",
        });
        userContext.setUser(result);
        setUploaderLoader(false)

      };
    }

  };
  return (
    <Card id="UploadProfileImageBox">
      <CardHeader title={t("profile.profileImage")} />
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="flex relative">
            <Avatar
              className={classes.large}
              src={userContext.user.profileImageUrl &&
                process.env.REACT_APP_API_URL + "/public/" +
                userContext.user.profileImageUrl
              }
            ></Avatar>
            <div className=" ml-24 absolute">
              {userContext.user.profileImageUrl && (
                <IconButton
                  onClick={async () => {
                    let result = await fetch({
                      url: Endpoints.user.editProfile,
                      method: "PUT",
                      data: {
                        removeProfileImageUrl: true,
                      },
                    });
                    userContext.setUser(result);
                  }}
                >
                  <DeleteOutlineOutlinedIcon color="primary" />
                </IconButton>
              )}
            </div>
          </div>
          <div className="mt-4 mb-2 flex flex-col justify-center">
            <Button disabled={uploaderLoader} color="primary" variant="outlined" component="label">
              <input
                accept="image/*"
                className={classes.input}
                id="profileImageUrl"
                name="profileImageUrl"
                type="file"
                onChange={(e) => {
                  handleUploadClick(e);
                }}
                onClick={(event) => {
                  event.target.value = null;
                }}
              />
              {t("profile.upload")}
            </Button>
            <div className="self-center mt-2">
              {uploaderLoader && <CircularProgress />}
            </div>
          </div>
          <div className="mt-2 mb-2 flex justify-center">
            <Typography color="textSecondary" variant="body1">
              {t("profile.uploadImageText")}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UploadProfileImageBox;
