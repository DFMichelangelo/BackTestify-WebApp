import React, { createContext, useState } from "react";
export const BacktesterContext = createContext();

function BacktesterProvider(props) {
    const [backtesterResults, setBacktesterResults] = useState();
    const [input, setInput] = useState();

    const BacktesterState = {
        backtesterResults, setBacktesterResults,
        input, setInput
    };

    return (
        <BacktesterContext.Provider value={BacktesterState}>
            {props.children}
        </BacktesterContext.Provider>
    );
}

export default BacktesterProvider;
