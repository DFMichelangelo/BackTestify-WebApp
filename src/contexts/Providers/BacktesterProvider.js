import React, { createContext, useState } from "react";
export const BacktesterContext = createContext();

function BacktesterProvider(props) {
    const [backtesterResults, setBacktesterResults] = useState({});
    /*const [strategies, setStrategies] = useState([]);
    const [startDate, setStartDate] = useState(DateTime.now().minus({ years: 1 }));
    const [endDate, setEndDate] = useState(DateTime.now());
    const [initialPortfolioValue, setInitialPortfolioValue] = useState(10000);
    
     */
    const BacktesterState = {
        backtesterResults, setBacktesterResults
    /*    startDate, setStartDate,
        strategies, setStrategies,
        startDate, setStartDate,
        endDate, setEndDate,
        initialPortfolioValue, setInitialPortfolioValue
    */};

    return (
        <BacktesterContext.Provider value={BacktesterState}>
            {props.children}
        </BacktesterContext.Provider>
    );
}

export default BacktesterProvider;
