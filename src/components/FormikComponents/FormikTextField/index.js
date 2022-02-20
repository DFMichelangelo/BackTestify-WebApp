import React from 'react'
import TextField from '@mui/material/TextField';
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";



let NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { id, onChange, formikInstance, ...other } = props;
    return (
        <NumberFormat
            key={id}
            getInputRef={ref}
            //onValueChange={(values, sourceInfo) => formikInstance.setFieldValue(id, values.floatValue)}
            onValueChange={values => onChange(values.floatValue)}
            thousandSeparator
            //thousandSeparator="."
            //decimalSeparator=","
            isNumericString
            {...other}
        />
    );
});

function FormikTextField(props) {
    const { formikInstance, id, label, type, disabled, readOnly, style, errorAfterTouch } = props
    const { t } = useTranslation();

    const onChangeNonNumber = e => formikInstance.handleChange(e)
    const onChangeNumber = e => formikInstance.setFieldValue(id, e)
    return (
        <TextField
            error={errorAfterTouch ? Boolean(formikInstance.touched[id] && formikInstance.errors[id]) : Boolean(formikInstance.errors[id])}
            style={style}
            id={id}
            label={t(label)}
            //type={type}
            onChange={type == "number" ? onChangeNumber : onChangeNonNumber}
            onBlur={formikInstance.handleBlur}
            value={formikInstance.values[id] || ""}
            disabled={disabled}
            readOnly={readOnly}
            helperText={t(formikInstance.errors[id])}
            //inputProps={{ inputProps }}//{{ inputMode: 'numeric', pattern: '[0-9]*' }}
            InputProps={(type == "number" ? {
                inputComponent: NumberFormatCustom,
            } : {})}

        />
    )
}

export default FormikTextField