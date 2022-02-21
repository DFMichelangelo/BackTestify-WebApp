import React from 'react'
import TextField from '@mui/material/TextField';
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";



let NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { id, onChange, ...other } = props;
    return (
        <NumberFormat
            id={id}
            key={id}
            getInputRef={ref}
            //onValueChange={(values, sourceInfo) => formikInstance.setFieldValue(id, values.floatValue)}
            onValueChange={values => onChange(values.floatValue)}
            //onBlur={formikInstance.handleBlur}
            thousandSeparator="˙"
            decimalSeparator="."
            isNumericString
            {...other}
        />
    );
});

function FormikTextField(props) {
    const { formikInstance, id, label, type, disabled, readOnly, size, style, InputProps, triggerAfterTouch } = props
    const { t } = useTranslation();

    const onChangeNonNumber = e => formikInstance.handleChange(e)
    const onChangeNumber = e => formikInstance.setFieldValue(id, e)

    return (
        <TextField
            error={triggerAfterTouch ? Boolean(formikInstance.touched[id] && formikInstance.errors[id]) : Boolean(formikInstance.errors[id])}
            style={style}
            id={id}
            size={size}
            label={t(label)}
            //type={type}
            onChange={type == "number" ? onChangeNumber : onChangeNonNumber}
            onBlur={formikInstance.handleBlur}
            value={formikInstance.values[id] || ""}
            disabled={disabled}
            readOnly={readOnly}
            helperText={
                triggerAfterTouch
                    ?
                    formikInstance.touched[id] && t(formikInstance.errors[id])
                    :
                    t(formikInstance.errors[id])
            }
            InputProps={(type == "number" ? {
                inputComponent: NumberFormatCustom,
                ...InputProps
            } : InputProps)}

        />
    )
}

export default FormikTextField