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
import Switch from '@mui/material/Switch';
import Endpoints from "Endpoints";
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import * as Yup from "yup";
import InputAdornment from '@mui/material/InputAdornment';
import DatePicker from '@mui/lab/DatePicker';
import classnames from "classnames";
import FormControlLabel from '@mui/material/FormControlLabel';
import FormikTextField from "components/FormikComponents/FormikTextField";
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { Typography } from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import Checkbox from '@mui/material/Checkbox';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import Masonry from '@mui/lab/Masonry';

function Input(props) {
  const themeContext = useContext(ThemeContext);
  const backtesterContext = useContext(BacktesterContext);
  const [disableButton, setDisableButton] = useState(true);
  const [strategies, setStrategies] = useState([])
  const [strategySelected, setStrategySelected] = useState(null)
  const [advancedSettings, setAdvancedSettings] = useState(true)
  const { t } = useTranslation();
  const { fetch: fetchStrategies, loading: loadingStrategies } = useFetch();
  const [validationTrigger, setValidationTrigger] = useState(true);

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
      durationAmount: 1,
      typeStartDate: "date",
      positionSizingType: "percentage",
      positionSizingAmount: 1,
      commissionsOnOrderFillEnabled: true,
      commissionsOnOrderFillType: "percentage",
      commissionsOnOrderFillAmount: 5,
      commissionsOvernightEnabled: true,
      commissionsOvernightType: "percentage",
      commissionsOvernightAmount: 5,
      orderFractioning: 0,
      minimumOrderSize: 0,
      takeProfitEnabled: true,
      takeProfitType: "percentage",
      takeProfitAmount: 5,
      stopLossEnabled: true,
      stopLossType: "percentage",
      stopLossAmount: 5,
      openNewOrderOnContrarianSignal: true
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
    benchmarkFinancialInstrumentName: Yup.string().required(),
    strategy: Yup.object().required(),
  });

  useEffect(async () => {
    themeContext.setTitle("backtester.input", <InputOutlinedIcon />);
    const result = await fetchStrategies({
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
        start_date: values.typeStartDate === "date" ?
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
      console.log(payload)
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
    validate: async (values) => {
      //validationSchema.isValid(values).then((e) => validationTrigger ? setDisableButton(!e) : setDisableButton(true));
      if (validationTrigger) validationSchema.isValid(values).then((e) => setDisableButton(!e));
    },
  });

  useEffect(() => {
    let show = advancedSettings
    inputBacktesterFormik.setFieldValue("commissionsOnOrderFillEnabled", show)
    inputBacktesterFormik.setFieldValue("commissionsOvernightEnabled", show)
    if (show == false) {
      inputBacktesterFormik.setFieldValue("orderFractioning", 0)
      inputBacktesterFormik.setFieldValue("minimumOrderSize", 0)
    }
  }, [advancedSettings])

  const toggleButtons = [

    <ToggleButton key="absoluteValue" value="absoluteValue">123</ToggleButton>,

    <ToggleButton key="percentage" value="percentage">%</ToggleButton>

  ]
  if (loadingStrategies) return <RoundLoader />;

  const showRewardRiskRatio = ((inputBacktesterFormik.values.stopLossEnabled && inputBacktesterFormik.values.takeProfitEnabled)
    && (inputBacktesterFormik.values.stopLossType == inputBacktesterFormik.values.takeProfitType))
  return (
    <form onSubmit={inputBacktesterFormik.handleSubmit} >
      <div className="flex items-center">
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

        <FormControlLabel
          control={<Switch size="large" />}
          label={t("backtester.advancedSettings")}
          checked={advancedSettings}
          onChange={() => setAdvancedSettings(!advancedSettings)}
        />
      </div>
      <Masonry columns={5} spacing={3} sx={{ margin: "0px !important" }}>
        <GenericCard title="backtester.dataInput" classNameContent="flex flex-col" width="300px" margins={{
          margin: "0px",
          marginTop: "10px",
          marginBottom: "10px",
        }}>
          <div className="flex justify-center items-center">
            <ToggleButtonGroup
              id="typeStartDate"
              color="primary"
              value={inputBacktesterFormik.values.typeStartDate}
              exclusive
              size="small"
              onChange={(newValue) => inputBacktesterFormik.setFieldValue("typeStartDate", newValue.target.value)}
            >
              <ToggleButton value="date">{t("backtester.date")}</ToggleButton>
              <ToggleButton value="duration">{t("backtester.duration")}</ToggleButton>
            </ToggleButtonGroup>
          </div>
          {inputBacktesterFormik.values.typeStartDate === "duration" ?
            <div className="flex">
              <FormikTextField
                formikInstance={inputBacktesterFormik}
                style={{ width: "45%" }}
                id="durationAmount"
                size="small"
                label={t("backtester.durationAmount")}
                type="number"
                inputProps={{ inputMode: "numberic", pattern: "^[1-9]\d*$" }}
              />

              <TextField
                style={{ width: "45%" }}
                select
                id="duration"
                size="small"
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
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          }
          <Divider variant="middle" />
          <DatePicker
            id="endDate"
            label={t("backtester.endDate")}
            maxDate={DateTime.now()}
            value={inputBacktesterFormik.values.endDate}
            onChange={(e) => inputBacktesterFormik.setFieldValue("endDate", e)}
            renderInput={(params) => <TextField {...params} size="small" />}
          />

          <TextField
            select
            id="timeframe"
            size="small"
            onChange={(newValue) => inputBacktesterFormik.setFieldValue("timeframe", newValue.target.value)}
            value={inputBacktesterFormik.values.timeframe}
            label={t("backtester.timeframe")}
            disabled
          >
            <MenuItem value={"1h"}>{t("backtester.hourly")}</MenuItem>
            <MenuItem value={"1d"}>{t("backtester.daily")}</MenuItem>
          </TextField>

          <FormikTextField
            formikInstance={inputBacktesterFormik}
            id="financialInstrumentName"
            label={t("backtester.financialInstrumentName")}
            size="small"
          />

          <FormikTextField
            formikInstance={inputBacktesterFormik}
            id="benchmarkFinancialInstrumentName"
            label={t("backtester.benchmarkFinancialInstrumentName")}
            size="small"
          />
        </GenericCard>
        <GenericCard title="backtester.portfolio" classNameContent="flex flex-col" margin={{
          margin: "0px",
          marginTop: "10px",
          marginBottom: "10px",
        }}>
          <FormikTextField
            id="initialPortfolioValue"
            label={t("backtester.initialPortfolioValue")}
            type="number"
            formikInstance={inputBacktesterFormik}
            size="small"
          />
          <Divider variant="middle" />
          <span className="tbd">
            <Typography variant="button" align="center" gutterBottom>
              {t("backtester.positionSizing")}
            </Typography>
            <div className="flex items-center  max-w-fit">
              <ToggleButtonGroup
                id="positionSizingType"
                color="primary"
                value={inputBacktesterFormik.values.positionSizingType}
                exclusive
                size="small"
                onChange={(newValue) => inputBacktesterFormik.setFieldValue("positionSizingType", newValue.target.value)}
              >
                {toggleButtons}
              </ToggleButtonGroup>
              <FormikTextField
                formikInstance={inputBacktesterFormik}
                id="positionSizingAmount"
                label={t("backtester.amount")}
                type="number"
                size="small"
                InputProps={{
                  endAdornment:
                    <InputAdornment position="end">
                      <span className={inputBacktesterFormik.values.positionSizingType == "percentage" ? "opacity-100" : "opacity-0"}>%</span>
                    </InputAdornment>
                }}
              />
            </div>
          </span>
        </GenericCard>
        <GenericCard title="backtester.exogenVariables" classNameContent="flex flex-col" margin={{
          margin: "0px",
          marginTop: "10px",
          marginBottom: "10px",
        }}>
          <FormikTextField
            formikInstance={inputBacktesterFormik}
            id="riskFreeRate"
            size="small"
            label={t("backtester.riskFreeRate")}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </GenericCard>
        <GenericCard title="backtester.strategy" classNameContent="flex flex-col" margin={{
          margin: "0px",
          marginTop: "10px",
          marginBottom: "10px",
        }}>
          <span className="tbd">
            <FormControlLabel
              sx={{ margin: "0px" }}
              control={
                <Switch
                  checked={inputBacktesterFormik.values.openNewOrderOnContrarianSignal}
                  onChange={(e) => inputBacktesterFormik.setFieldValue("openNewOrderOnContrarianSignal", e.target.checked)}
                />}
              label={<Typography variant="body2" gutterBottom>{t("backtester.openNewOrderOnContrarianSignal")}</Typography>} />
          </span>
          <Divider variant="middle" />
          <TextField
            select
            id="strategy"
            size="small"
            onChange={(newValue) => {
              setValidationTrigger(false);
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
              ).then((e) => {
                setDisableButton(!e)
                setValidationTrigger(true);
              });
            }
            }
            value={inputBacktesterFormik.values.strategy}
            label={t("backtester.strategy")}
          >
            {strategies.map((strategy) => <MenuItem key={strategy.name} value={strategy}>{strategy.name}</MenuItem>)}
          </TextField>

          {strategySelected?.indicators_parameters_config && strategySelected.indicators_parameters_config.map(indicator_config =>
            <FormikTextField
              size="small"
              triggerAfterTouch
              key={indicator_config.name}
              formikInstance={inputBacktesterFormik}
              id={indicator_config.name}
              label={indicator_config.name}
              type="number"
            />
          )}
        </GenericCard>

        {advancedSettings && <GenericCard title="backtester.commissions" classNameContent="flex flex-col" margin={{
          margin: "0px",
          marginTop: "10px",
          marginBottom: "10px",
        }}>
          <span className="tbd">

            <FormControlLabel
              id="commissionsOnOrderFillEnabled"
              control={<Checkbox />}
              label={t("backtester.onOrderFill")}
              checked={inputBacktesterFormik.values.commissionsOnOrderFillEnabled}
              onChange={newValue => inputBacktesterFormik.setFieldValue("commissionsOnOrderFillEnabled", newValue.target.checked)}
            />
            <div className="flex items-center  max-w-fit">
              <ToggleButtonGroup
                id="commissionsOnOrderFillType"
                color="primary"
                value={inputBacktesterFormik.values.commissionsOnOrderFillEnabled ? inputBacktesterFormik.values.commissionsOnOrderFillType : ""}
                exclusive
                size="small"
                disabled={!inputBacktesterFormik.values.commissionsOnOrderFillEnabled}
                onChange={(newValue) => inputBacktesterFormik.setFieldValue("commissionsOnOrderFillType", newValue.target.value)}
              >
                {toggleButtons}
              </ToggleButtonGroup>
              <FormikTextField
                size="small"
                formikInstance={inputBacktesterFormik}
                id="commissionsOnOrderFillAmount"
                label={t("backtester.commissionsPerOrder")}
                type="number"
                disabled={!inputBacktesterFormik.values.commissionsOnOrderFillEnabled}
                InputProps={{
                  endAdornment:
                    <InputAdornment position="end">
                      <span className={inputBacktesterFormik.values.commissionsOnOrderFillType == "percentage" ? "opacity-100" : "opacity-0"}>%</span>
                    </InputAdornment>
                }}
              />
            </div>
            <Divider variant="middle" />


            <FormControlLabel
              id="commissionsOvernightEnabled"
              control={<Checkbox />}
              label={t("backtester.overnight")}
              checked={inputBacktesterFormik.values.commissionsOvernightEnabled}
              onChange={newValue => inputBacktesterFormik.setFieldValue("commissionsOvernightEnabled", newValue.target.checked)}
            />
            <div className="flex items-center  max-w-fit">
              <ToggleButtonGroup
                id="commissionsOvernightType"
                color="primary"
                value={inputBacktesterFormik.values.commissionsOvernightEnabled ? inputBacktesterFormik.values.commissionsOvernightType : ""}
                exclusive
                size="small"
                disabled={!inputBacktesterFormik.values.commissionsOvernightEnabled}
                onChange={(newValue) => inputBacktesterFormik.setFieldValue("commissionsOvernightType", newValue.target.value)}
              >
                {toggleButtons}
              </ToggleButtonGroup>
              <FormikTextField
                size="small"
                formikInstance={inputBacktesterFormik}
                id="commissionsOvernightAmount"
                label={t("backtester.commissionsPerOrder")}
                type="number"
                disabled={!inputBacktesterFormik.values.commissionsOvernightEnabled}
                InputProps={{
                  endAdornment:
                    <InputAdornment position="end">
                      <span className={inputBacktesterFormik.values.commissionsOvernightType == "percentage" ? "opacity-100" : "opacity-0"}>%</span>
                    </InputAdornment>
                }}
              />
            </div>
          </span>
        </GenericCard>}
        <GenericCard title="backtester.brokerSettings" margin={{
          margin: "0px",
          marginTop: "10px",
          marginBottom: "10px",
        }}>
          <span className="tbd">
            <div className="flex flex-col">
              <TextField
                select
                id="orderFractioning"
                size="small"
                onChange={(newValue) => inputBacktesterFormik.setFieldValue("orderFractioning", newValue.target.value)}
                value={inputBacktesterFormik.values.orderFractioning}
                label={t("backtester.orderFractioning")}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={0.1}>0.1</MenuItem>
                <MenuItem value={0.01}>0.01</MenuItem>
                <MenuItem value={0}>{t("backtester.fluidFractioning")}</MenuItem>
              </TextField>

              <TextField
                select
                id="minimumOrderSize"
                size="small"
                onChange={(newValue) => inputBacktesterFormik.setFieldValue("minimumOrderSize", newValue.target.value)}
                value={inputBacktesterFormik.values.minimumOrderSize}
                label={t("backtester.minimumOrderSize")}
              >
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={0.1}>0.1</MenuItem>
                <MenuItem value={0.01}>0.01</MenuItem>
                <MenuItem value={0}>{t("backtester.noMinimumSize")}</MenuItem>
              </TextField>
            </div>
          </span>
        </GenericCard>
        <GenericCard title="backtester.stopLossAndTakeProfit" margin={{
          margin: "0px",
          marginTop: "10px",
          marginBottom: "10px",
        }}>
          <span className="tbd">
            <FormControlLabel
              id="takeProfitEnabled"
              control={<Checkbox />}
              label={t("backtester.takeProfitEnabled")}
              checked={inputBacktesterFormik.values.takeProfitEnabled}
              onChange={newValue => inputBacktesterFormik.setFieldValue("takeProfitEnabled", newValue.target.checked)}
            />

            <div className="flex items-center  max-w-fit">
              <ToggleButtonGroup
                id="takeProfitType"
                color="primary"
                value={inputBacktesterFormik.values.takeProfitEnabled ? inputBacktesterFormik.values.takeProfitType : ""}
                exclusive
                size="small"
                disabled={!inputBacktesterFormik.values.takeProfitEnabled}
                onChange={(newValue) => inputBacktesterFormik.setFieldValue("takeProfitType", newValue.target.value)}
              >
                {toggleButtons}
              </ToggleButtonGroup>
              <FormikTextField
                size="small"
                formikInstance={inputBacktesterFormik}
                id="takeProfitAmount"
                label={t("backtester.takeProfitAmount")}
                type="number"
                disabled={!inputBacktesterFormik.values.takeProfitEnabled}
                InputProps={{
                  endAdornment:
                    <InputAdornment position="end">
                      <span className={inputBacktesterFormik.values.takeProfitType == "percentage" ? "opacity-100" : "opacity-0"}>%</span>
                    </InputAdornment>
                }}
              />
            </div>
            <FormControlLabel

              id="stopLossEnabled"
              control={<Checkbox />}
              label={t("backtester.stopLossEnabled")}
              checked={inputBacktesterFormik.values.stopLossEnabled}
              onChange={newValue => inputBacktesterFormik.setFieldValue("stopLossEnabled", newValue.target.checked)}
            />

            <div className="flex items-center  max-w-fit">
              <ToggleButtonGroup
                id="stopLossType"
                color="primary"
                value={inputBacktesterFormik.values.stopLossEnabled ? inputBacktesterFormik.values.stopLossType : ""}
                exclusive
                size="small"
                disabled={!inputBacktesterFormik.values.stopLossEnabled}
                onChange={(newValue) => inputBacktesterFormik.setFieldValue("stopLossType", newValue.target.value)}
              >
                {toggleButtons}
              </ToggleButtonGroup>
              <FormikTextField
                size="small"
                formikInstance={inputBacktesterFormik}
                id="stopLossAmount"
                label={t("backtester.stopLossAmount")}
                type="number"
                disabled={!inputBacktesterFormik.values.stopLossEnabled}
                InputProps={{
                  endAdornment:
                    <InputAdornment position="end">
                      <span className={inputBacktesterFormik.values.stopLossType == "percentage" ? "opacity-100" : "opacity-0"}>%</span>
                    </InputAdornment>
                }}
              />
            </div>
            {/*            <span className={classnames(showRewardRiskRatio ? "visible" : "invisible")}>*/}
            {showRewardRiskRatio &&
              <Typography align="center" variant="body1" >
                {t("backtester.rewardToRiskRatio") + ": " + (inputBacktesterFormik.values.takeProfitAmount / inputBacktesterFormik.values.stopLossAmount).toFixed(2)}
              </Typography>}
            {/*</span>*/}
          </span>
        </GenericCard>
      </Masonry>
    </form >
  )
}

export default Input;
