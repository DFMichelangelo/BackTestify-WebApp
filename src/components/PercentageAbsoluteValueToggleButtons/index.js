import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';

function PercentageAbsoluteValueToggleButtons(props) {
    return (
        <>

            <ToggleButton key="absolute_value" value="absolute_value">123</ToggleButton>,

            <ToggleButton key="percentage" value="percentage">%</ToggleButton>

        </>
    );
}

export default PercentageAbsoluteValueToggleButtons;