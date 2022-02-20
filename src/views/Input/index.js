import React, { useEffect, useContext, useState } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import { useFormik } from "formik";
import useFetch from "hooks/useFetch";
import { useTranslation } from "react-i18next";
import { DateTime } from "luxon";
import MenuItem from '@mui/material/MenuItem';
import GenericCard from "components/GenericCard";
import RoundLoader from "components/RoundLoader";
import Endpoints from "Endpoints";
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import * as Yup from "yup";
import InputAdornment from '@mui/material/InputAdornment';
import DatePicker from '@mui/lab/DatePicker';

import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import { Typography } from "@mui/material";
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
function Input(props) {
  const themeContext = useContext(ThemeContext);
  const backtesterContext = useContext(BacktesterContext);
  const [disableButton, setDisableButton] = useState(true);
  const [strategies, setStrategies] = useState([])
  const [strategySelected, setStrategySelected] = useState(null)
  const { t } = useTranslation();
  const { fetch, loading } = useFetch();
  const [typeStartDate, setTypeStartDate] = useState("date");
  const [initialValues, setInitialValues] = useState({
    initial: {
      startDate: DateTime.now().minus({ years: 1 }),
      endDate: DateTime.now(),
      initialPortfolioValue: 500,
      riskFreeRate: 1,
      financialInstrumentName: "AAPL",
      timeframe: "1d",
      strategy: strategySelected || "",
      benchmarkFinancialInstrumentName: "^GSPC",
      durationType: "years",
      durationAmount: 1
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
    durationAmount: Yup.number().min(0).required(),
    durationType: Yup.string().required(),
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
      //INFO - Creation of the object to send
      let payload = {
        start_date: typeStartDate === "date" ?
          values.startDate.set({ hours: 0, minutes: 0, seconds: 0 }).toFormat("d/MM/y HH:mm:ss")
          : values.endDate.set({ hours: 0, minutes: 0, seconds: 0 }).minus({ days: values.days, months: values.months, years: values.years }).toFormat("d/MM/y HH:mm:ss"),
        end_date: values.endDate.set({ hours: 0, minutes: 0, seconds: 0 }).toFormat("d/MM/y HH:mm:ss"),
        initial_portfolio_value: values.initialPortfolioValue,
        risk_free_rate: values.riskFreeRate / 100,
        benchmark_financial_instrument_name: values.benchmarkFinancialInstrumentName,
        strategy_name: values.strategy.name,
        input_data: {
          timeframe: values.timeframe,
          financial_instrument_name: values.financialInstrumentName,
        },
        indicators_parameters
      }
      try {
        const result = await fetchBacktest({
          url: Endpoints.backtester.backtestStrategy,
          baseUrl: process.env.REACT_APP_BACKTESTER_ENGINE_URL,
          showStatus400ErrorSnackBar: false,
          method: "POST",
          data: payload
        });
        console.log(result)
        backtesterContext.setBacktesterResults(result)
        themeContext.showSuccessSnackbar({ message: "backtester.backtestCompleted" });
      } catch (e) {
        themeContext.showErrorSnackbar({ message: e.data.detail });
      }
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
          <GenericCard title="backtester.dataInput" classNameContent="flex flex-col" width="300px">
            <div className="flex justify-center">
              <Typography variant="overline">{t("backtester.date")}</Typography>
              <Switch
                checked={typeStartDate === "date" ? false : true}
                onChange={(e) => setTypeStartDate(typeStartDate === "date" ? "duration" : "date")}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              <Typography variant="overline">{t("backtester.duration")}</Typography>
            </div>
            {typeStartDate === "duration" ?
              <div className="flex">
                <TextField
                  error={
                    inputBacktesterFormik.touched.durationAmount && Boolean(inputBacktesterFormik.errors.durationAmount)
                  }
                  style={{ width: "45%" }}
                  id="durationAmount"
                  label={t("backtester.durationAmount")}
                  type="number"
                  onChange={inputBacktesterFormik.handleChange}
                  onBlur={inputBacktesterFormik.handleBlur}
                  value={inputBacktesterFormik.values.durationAmount}
                  helperText={
                    inputBacktesterFormik.touched.durationAmount &&
                    t(inputBacktesterFormik.errors.durationAmount)
                  }
                />

                <TextField
                  style={{ width: "45%" }}
                  select
                  id="duration"
                  onChange={(newValue) => inputBacktesterFormik.setFieldValue("dirationType", newValue.target.value)}
                  value={inputBacktesterFormik.values.durationType}
                  label={t("backtester.durationType")}
                >
                  <MenuItem value={"days"}>{t("backtester.days")}</MenuItem>
                  <MenuItem value={"months"}>{t("backtester.months")}</MenuItem>
                  <MenuItem value={"years"}>{t("backtester.years")}</MenuItem>
                </TextField>
              </div>
              :
              <DatePicker
                id="startDate"
                label={t("backtester.startDate")}
                maxDate={DateTime.now()}
                value={inputBacktesterFormik.values.startDate}
                onChange={(e) => inputBacktesterFormik.setFieldValue("startDate", e)}
                renderInput={(params) => <TextField {...params} />}
              />
            }
            <Divider variant="middle" />
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
              onChange={(newValue) => inputBacktesterFormik.setFieldValue("timeframe", newValue.target.value)}
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
          <div className="flex flex-col">
            <GenericCard title="backtester.portfolio" classNameContent="flex flex-col">
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
            <GenericCard title="backtester.exogenVariables" classNameContent="flex flex-col">
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
          </div>
          <GenericCard title="backtester.strategy" classNameContent="flex flex-col">
            <TextField
              select
              id="strategy"

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
        <LoadingButton
          style={{ margin: "10px" }}
          size="large"
          loading={inputBacktesterFormik.isSubmitting}
          endIcon={<UpdateOutlinedIcon />}
          type="submit"
          variant="contained"
          disabled={disableButton}
          loadingPosition="end"
        >
          {t("backtester.backtest")}
        </LoadingButton>
      </form>
    </div >)
}

export default Input;
