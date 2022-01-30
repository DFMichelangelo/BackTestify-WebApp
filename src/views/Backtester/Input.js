import React from "react";
import Button from '@mui/material/Button';

function Input(props) {
    const { strategies } = props;
    return (<div>
        <Button variant="outlined">
            BackTest
        </Button>
    </div>)
}

export default Input