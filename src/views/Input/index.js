import React, { useEffect, useContext, useState } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { UserContext } from "contexts/Providers/UserProvider";
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import { useFormik } from "formik";
import useFetch from "hooks/useFetch";
import { useTranslation } from "react-i18next";
import { DateTime } from "luxon";
import RoundLoader from "components/RoundLoader";
import Switch from '@mui/material/Switch';
import Endpoints from "Endpoints";
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import * as Yup from "yup";
import FormControlLabel from '@mui/material/FormControlLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import Masonry from '@mui/lab/Masonry';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import FinancialInstruments from "components/FinancialInstruments";
import Portfolio from "./Portfolio";
import Broker from "./Broker";
import ExogenVariables from "./ExogenVariables";
import Commissions from "./Commissions";
import StopLossAndTakeProfit from "./StopLossAndTakeProfit";
import Strategy from "./Strategy";
import ToggleButton from '@mui/material/ToggleButton';
function Input(props) {
  const themeContext = useContext(ThemeContext);
  const userContext = useContext(UserContext);
  const backtesterContext = useContext(BacktesterContext);
  const [disableButton, setDisableButton] = useState(true);
  const [strategies, setStrategies] = useState([])
  const [strategySelected, setStrategySelected] = useState(null)
  const [advancedSettings, setAdvancedSettings] = useState(true)
  const { t } = useTranslation();
  const { fetch: fetchStrategies, loading: loadingStrategies } = useFetch();
  const { fetch: fetchSaveBacktest, loading: loadingSaveBacktest } = useFetch({ initialLoading: false });
  const [validationTrigger, setValidationTrigger] = useState(true);

  const [initialValues, setInitialValues] = useState({
    initial: {
      startDate: DateTime.now().minus({ years: 1, days: 1 }),
      endDate: DateTime.now().minus({ days: 1 }),
      timeframe: "1d",
      financialInstrumentName: "AAPL",
      benchmarkFinancialInstrumentName: "^GSPC",
      durationType: "years",
      durationAmount: 1,
      typeStartDate: "date",
      initialPortfolioValue: 500,
      riskFreeRate: 1,
      strategy: "",
      orderSizeType: "percentage",
      orderSizeAmount: 10,
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
      stopLossAmount: -5,
      openNewOrderOnContrarianSignal: true,
      ordersPositionsLimitations: "no_limitations", // INFO - no_limitations, long_only, short_only

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
    financialInstrumentName: Yup.string().required(),
    benchmarkFinancialInstrumentName: Yup.string().required(),
    initialPortfolioValue: Yup.number().min(1).required(),
    riskFreeRate: Yup.number().required(),
    durationAmount: Yup.number().min(0).required(),
    durationType: Yup.string().required(),
    strategy: Yup.object().required(),
    orderSizeType: Yup.string().required(),
    orderSizeAmount: Yup.number().when("orderSizeType",
      {
        is: "percentage",
        then: Yup.number().min(0).max(100).required(),
        otherwise: Yup.number().min(0).required()
      }),
    takeProfitEnabled: Yup.boolean().required(),
    takeProfitType: Yup.string().required(),
    takeProfitAmount: Yup.number().when("takeProfitEnabled", {
      is: true,
      then: Yup.number().min(0).required(),
    }),
    stopLossEnabled: Yup.boolean().required(),
    stopLossType: Yup.string().required(),
    stopLossAmount: Yup.number().when("stopLossEnabled", {
      is: true,
      then: Yup.number().max(0).required(),
    }),
  });

  const saveBacktest = async event => {
    try {
      await fetchSaveBacktest({
        url: Endpoints.backtester.saveBacktest,
        baseUrl: process.env.REACT_APP_BACKTESTER_ENGINE_URL,
        method: "POST",
        data: {
          input: backtesterContext.input,
          result: backtesterContext.backtesterResults,
        }
      })
      themeContext.showSuccessSnackbar({ message: "backtester.backtestSavedSuccessfully" });
      backtesterContext.setInput(null)
    } catch (e) {
      themeContext.showErrorSnackbar({ message: e.data });
    }
  }

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
          values.startDate.set({ hours: 0, minutes: 0, seconds: 0 }).toMillis()
          : values.endDate.set({ hours: 0, minutes: 0, seconds: 0 }).minus({ [values.durationType]: values.durationAmount }).toMillis(),
        end_date: values.endDate.set({ hours: 0, minutes: 0, seconds: 0 }).toMillis(),
        portfolio: {
          initial_portfolio_value: values.initialPortfolioValue,
          order_size_type: values.orderSizeType,
          order_size_amount: values.orderSizeType === "percentage" ? values.orderSizeAmount / 100 : values.orderSizeAmount,
        },
        stop_loss_and_take_profit: {
          take_profit_enabled: values.takeProfitEnabled,
          take_profit_type: values.takeProfitType,
          take_profit_amount: values.takeProfitType === "percentage" ? values.takeProfitAmount / 100 : values.takeProfitAmount,
          stop_loss_enabled: values.stopLossEnabled,
          stop_loss_type: values.stopLossType,
          stop_loss_amount: values.stopLossType === "percentage" ? values.stopLossAmount / 100 : values.stopLossAmount,
        },
        open_new_order_on_contrarian_signal: values.openNewOrderOnContrarianSignal,
        orders_positions_limitations: values.ordersPositionsLimitations,
        risk_free_rate: values.riskFreeRate / 100,
        benchmark_financial_instrument_name: values.benchmarkFinancialInstrumentName,
        strategy_name: values.strategy.name,
        timeframe: values.timeframe,
        financial_instrument_name: values.financialInstrumentName,
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

        backtesterContext.setInput(payload)
        backtesterContext.setBacktesterResults(result)
        themeContext.showSuccessSnackbar({ message: "backtester.backtestCompleted" });
      } catch (e) {
        themeContext.showErrorSnackbar({ message: e.data });
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

  if (loadingStrategies) return <RoundLoader />;

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
        <div className="test flex w-full justify-around">
          <FormControlLabel
            control={<Switch size="large" />}
            label={t("backtester.advancedSettings")}
            checked={advancedSettings}
            onChange={() => setAdvancedSettings(!advancedSettings)}
          />
          {userContext.user &&
            <LoadingButton

              size="large"
              loading={loadingSaveBacktest}
              variant="contained"
              onClick={saveBacktest}
              startIcon={<SaveOutlinedIcon />}
              disabled={!backtesterContext.input}
              loadingPosition="start"
            >
              {t("backtester.saveBacktest")}
            </LoadingButton>
          }
        </div>
      </div>
      <Masonry columns={4} spacing={3} sx={{ margin: "0px !important" }}>
        <FinancialInstruments formikInstance={inputBacktesterFormik} />
        <Portfolio formikInstance={inputBacktesterFormik} />
        <ExogenVariables formikInstance={inputBacktesterFormik} />
        <Strategy
          formikInstance={inputBacktesterFormik}
          setValidationTrigger={setValidationTrigger}
          setStrategySelected={setStrategySelected}
          setInitialValues={setInitialValues}
          validationSchema={validationSchema}
          setDisableButton={setDisableButton}
          strategies={strategies}
          strategySelected={strategySelected}
        />



        {advancedSettings && <Commissions formikInstance={inputBacktesterFormik} />}
        {advancedSettings && <Broker formikInstance={inputBacktesterFormik} />}
        <StopLossAndTakeProfit formikInstance={inputBacktesterFormik} />
      </Masonry>
    </form >
  )
}

export default Input;
