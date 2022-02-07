import React, { useEffect, useContext, useState } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import { useFormik } from "formik";
import useFetch from "hooks/useFetch";
import { useTranslation } from "react-i18next";
import { DateTime } from "luxon";
import MenuItem from '@mui/material/MenuItem';
import GenericCard from "components/GenericCard";
import Select from '@mui/material/Select';
import RoundLoader from "components/RoundLoader";
import Endpoints from "Endpoints";
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import * as Yup from "yup";
import Button from "@mui/material/Button";
import InputAdornment from '@mui/material/InputAdornment';
import DatePicker from '@mui/lab/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
function Input(props) {
  const themeContext = useContext(ThemeContext);
  const backtesterContext = useContext(BacktesterContext);
  const [disableButton, setDisableButton] = useState(true);
  const [strategies, setStrategies] = useState([])
  const [strategySelected, setStrategySelected] = useState(null)
  const { t } = useTranslation();
  const { fetch, loading } = useFetch();
  const [validationTrigger, setValidationTrigger] = useState(false);
  const [initialValues, setInitialValues] = useState({
    initial: {
      startDate: DateTime.now().minus({ years: 1 }),
      endDate: DateTime.now(),
      initialPortfolioValue: 100000,
      riskFreeRate: 1,
      financialInstrumentName: "AAPL",
      timeframe: "1d",
      strategy: strategySelected || "",
      benchmarkFinancialInstrumentName: "SPY",
    },
    additional: {}
  });
  const { fetch: fetchBacktest } = useFetch();

  const createValidationForInputParameters = () => {
    let obj = {}
    strategySelected?.indicators_parameters_config.map(indicator => obj[indicator.name] = Yup.number().min(0).required())
    //if (validationTrigger == false) setValidationTrigger(true)
    return obj
  }


  let validationSchema = Yup.object({
    ...strategySelected?.indicators_parameters_config && createValidationForInputParameters(),
    startDate: Yup.date().required(),
    endDate: Yup.date().required(),
    initialPortfolioValue: Yup.number().min(1).required(),
    riskFreeRate: Yup.number().required(),
    financialInstrumentName: Yup.string().required(),
    strategy: Yup.object().required(),
  });


  useEffect(async () => {
    themeContext.setTitle("backtester.input", <InputOutlinedIcon />);
    const result = await fetch({
      url: Endpoints.backtester.getStrategies,
      baseUrl: process.env.REACT_APP_BACKTESTER_ENGINE_URL,
      method: "GET"
    })
    setStrategySelected(result[0])
    let obj = {}
    result[0].indicators_parameters_config.map(indicator => obj[indicator.name] = indicator.default_value)
    setInitialValues({
      initial: { ...initialValues.initial, strategy: result[0] },
      additional: obj
    })
    validationSchema.isValid({
      ...initialValues.initial, strategy: result[0],
      ...obj
    }).then((e) => setDisableButton(!e));

    setStrategies(result)
  }, []);

  const inputBacktesterFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initialValues.initial,
      ...initialValues.additional
    },
    onSubmit: async (values, formikBag) => {
      let indicators_parameters = {}
      strategySelected.indicators_parameters_config.map(indicator => indicators_parameters[indicator.name] = values[indicator.name])
      console.log(indicators_parameters)
      //INFO - Creation of the object to send
      let payload = {
        start_date: values.startDate.set({ hours: 0, minutes: 0, seconds: 0 }).toFormat("d/MM/y HH:mm:ss"),
        end_date: values.endDate.set({ hours: 0, minutes: 0, seconds: 0 }).toFormat("d/MM/y HH:mm:ss"),
        initial_portfolio_value: values.initialPortfolioValue,
        risk_free_rate: values.riskFreeRate,
        benchmark_financial_instrument_name: values.benchmarkFinancialInstrumentName,
        strategy_name: values.strategy.name,
        input_data: {
          timeframe: values.timeframe,
          financial_instrument_name: values.financialInstrumentName,
        },
        indicators_parameters
      }
      console.log(payload)
      const result = await fetchBacktest({
        url: Endpoints.backtester.backtestStrategy,
        baseUrl: process.env.REACT_APP_BACKTESTER_ENGINE_URL,
        method: "POST",
        data: payload
      });
      console.log(result)
      backtesterContext.setBacktestResults(result)
    },
    validationSchema,
    validate: (values) => {
      //validationSchema.isValid(values).then((e) => validationTrigger ? setDisableButton(!e) : setDisableButton(true));
      validationSchema.isValid(values).then((e) => setDisableButton(!e));
    },
  });


  if (loading) return <RoundLoader />;

  return (
    <div>
      <form onSubmit={inputBacktesterFormik.handleSubmit} >
        <div className="flex flex-wrap">
          <GenericCard title="backtester.dataInput" className="flex flex-col">
            <DatePicker
              id="startDate"
              label={t("backtester.startDate")}
              maxDate={DateTime.now()}
              value={inputBacktesterFormik.values.startDate}
              onChange={(e) => inputBacktesterFormik.setFieldValue("startDate", e)}
              renderInput={(params) => <TextField {...params} />}
            />

            <DatePicker
              id="endDate"
              label={t("backtester.endDate")}
              maxDate={DateTime.now()}
              value={inputBacktesterFormik.values.endDate}
              onChange={(e) => inputBacktesterFormik.setFieldValue("endDate", e)}
              renderInput={(params) => <TextField {...params} />}
            />

            <TextField
              select
              id="timeframe"
              style={{ width: "260px" }}
              onChange={(newValue) => inputBacktesterFormik.setFieldValue("timeframe", newValue.target.value)
              }
              value={inputBacktesterFormik.values.timeframe}
              label={t("backtester.timeframe")}
              disabled
            >
              <MenuItem value={"1h"}>{t("backtester.hourly")}</MenuItem>
              <MenuItem value={"1d"}>{t("backtester.daily")}</MenuItem>
            </TextField>

            <TextField
              error={
                inputBacktesterFormik.touched.financialInstrumentName && Boolean(inputBacktesterFormik.errors.financialInstrumentName)
              }
              id="financialInstrumentName"
              label={t("backtester.financialInstrumentName")}
              onChange={inputBacktesterFormik.handleChange}
              onBlur={inputBacktesterFormik.handleBlur}
              value={inputBacktesterFormik.values.financialInstrumentName}
              helperText={
                inputBacktesterFormik.touched.financialInstrumentName &&
                t(inputBacktesterFormik.errors.financialInstrumentName)
              }
            />

            <TextField
              error={
                inputBacktesterFormik.touched.benchmarkFinancialInstrumentName && Boolean(inputBacktesterFormik.errors.benchmarkFinancialInstrumentName)
              }
              id="benchmarkFinancialInstrumentName"
              label={t("backtester.benchmarkFinancialInstrumentName")}
              onChange={inputBacktesterFormik.handleChange}
              onBlur={inputBacktesterFormik.handleBlur}
              value={inputBacktesterFormik.values.benchmarkFinancialInstrumentName}
              helperText={
                inputBacktesterFormik.touched.benchmarkFinancialInstrumentName &&
                t(inputBacktesterFormik.errors.benchmarkFinancialInstrumentName)
              }
            />
          </GenericCard>
          <GenericCard title="backtester.portfolio" className="flex flex-col">
            <TextField
              error={
                inputBacktesterFormik.touched.initialPortfolioValue && Boolean(inputBacktesterFormik.errors.initialPortfolioValue)
              }
              id="initialPortfolioValue"
              label={t("backtester.initialPortfolioValue")}
              type="number"
              onChange={inputBacktesterFormik.handleChange}
              onBlur={inputBacktesterFormik.handleBlur}
              value={inputBacktesterFormik.values.initialPortfolioValue}
              helperText={
                inputBacktesterFormik.touched.initialPortfolioValue &&
                t(inputBacktesterFormik.errors.initialPortfolioValue)
              }
            />
          </GenericCard>
          <GenericCard title="backtester.exogenVariables" className="flex flex-col">
            <TextField
              error={
                inputBacktesterFormik.touched.riskFreeRate && Boolean(inputBacktesterFormik.errors.riskFreeRate)
              }
              id="riskFreeRate"
              label={t("backtester.riskFreeRate")}
              type="number"
              onChange={inputBacktesterFormik.handleChange}
              onBlur={inputBacktesterFormik.handleBlur}
              value={inputBacktesterFormik.values.riskFreeRate}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              helperText={
                inputBacktesterFormik.touched.riskFreeRate &&
                t(inputBacktesterFormik.errors.riskFreeRate)
              }
            />
          </GenericCard>
          <GenericCard title="backtester.strategy" className="flex flex-col">
            <TextField
              select
              id="strategy"
              style={{ width: "300px" }}
              onChange={(newValue) => {
                setStrategySelected(newValue.target.value)
                let obj = {}
                newValue.target.value.indicators_parameters_config.map(indicator => obj[indicator.name] = indicator.default_value)
                setInitialValues({
                  initial: { ...inputBacktesterFormik.values, strategy: newValue.target.value },
                  additional: obj
                })
                validationSchema.isValid(
                  {
                    ...inputBacktesterFormik.values,
                    strategy: newValue.target.value,
                    ...obj
                  }
                ).then((e) => setDisableButton(!e));
              }
              }
              value={inputBacktesterFormik.values.strategy}
              label={t("backtester.strategy")}
            >
              {strategies.map((strategy) => <MenuItem key={strategy.name} value={strategy}>{strategy.name}</MenuItem>)}
            </TextField>

            {strategySelected?.indicators_parameters_config && strategySelected.indicators_parameters_config.map((indicator_config) =>
              <TextField
                key={indicator_config.name}
                error={
                  inputBacktesterFormik.touched[indicator_config.name] && Boolean(inputBacktesterFormik.errors[indicator_config.name])
                }
                id={indicator_config.name}
                label={indicator_config.name}
                onChange={inputBacktesterFormik.handleChange}
                onBlur={inputBacktesterFormik.handleBlur}
                type="number"
                value={inputBacktesterFormik.values[indicator_config.name] || ""}
                helperText={
                  inputBacktesterFormik.touched[indicator_config.name] &&
                  t(inputBacktesterFormik.errors[indicator_config.name])
                }
              />
            )}
          </GenericCard>
        </div>

        <Button
          style={{ margin: "10px" }}
          size="large"
          type="submit"
          variant="contained"
          disabled={disableButton || inputBacktesterFormik.isSubmitting
          }
        >
          {t("backtester.backtest")}
        </Button>

      </form>





    </div >)
}

export default Input;
