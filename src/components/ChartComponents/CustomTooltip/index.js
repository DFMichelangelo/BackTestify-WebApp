import { fromTimestampToDateString } from "auxiliaries/dates";
import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Tooltip } from 'recharts';


function CustomTooltip(props) {
    const { t } = useTranslation()
    return (
        [<Tooltip
            key="tooltip"
            labelFormatter={elem => fromTimestampToDateString(elem)}
            formatter={(value, name, props) => {
                const formatValue = (v) => {
                    if (typeof v == 'number') return v.toFixed(2)
                    if (Array.isArray(v)) {
                        let a = v.map(val => formatValue(val))
                        for (let i = 0; i < a.length; i++) {
                            if (i % 2 != 0) a.splice(i, 0, " ~ ")
                        }
                        return a
                    }
                    return value
                }
                value = formatValue(value)
                return [value, t(`backtester.${name}`)]
            }
            }
        />]

    )
}

export default CustomTooltip;