import React, { useState } from "react";
import { Trans } from "react-i18next";
import { Legend } from 'recharts';


function CustomLegend(props) {
    const [opacity, setOpacity] = useState({});

    const handleMouseEnter = (o) => setOpacity({ ...opacity, [o.dataKey]: 0.5 });

    const handleMouseLeave = (o) => setOpacity({ ...opacity, [o.dataKey]: 1 });


    return (
        [<Legend
            key="legend"
            //onMouseEnter={handleMouseEnter}
            //onMouseLeave={handleMouseLeave}}
            formatter={(value, entry, index) => <span key={value} style={{ color: entry.color }}><Trans>{`backtester.${value}`}</Trans></span>}
        />]

    )
}

export default CustomLegend;