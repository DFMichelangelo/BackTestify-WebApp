import React from 'react'
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function FieldAndValue(props) {
    const { field, value } = props

    return (
        <Typography component={'span'} >
            <Box fontWeight='fontWeightBold' display='inline'>
                {t(field)}:{" "}
            </Box>
            {value}
        </Typography>
    )
}

export default FieldAndValue