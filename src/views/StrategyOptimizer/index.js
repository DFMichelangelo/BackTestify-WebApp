import React, { useEffect, useContext, useState } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import Divider from '@mui/material/Divider';
import * as Yup from "yup";
import { useFormik } from "formik";
import LoadingButton from '@mui/lab/LoadingButton';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import { useTranslation } from "react-i18next";
import { DateTime } from "luxon";
import SelectFitnessFunction from "./StaticParameters/SelectFitnessFunction";
import Endpoints from "Endpoints";
import Typography from '@mui/material/Typography';
import useFetch from "hooks/useFetch";
import RoundLoader from "components/RoundLoader";
import FinancialInstruments from "components/FinancialInstruments";
import Portfolio from "./StaticParameters/Portfolio";
import ExogenVariables from "views/Input/ExogenVariables";
function StrategyOptimizer(props) {
    const [fitnessFunctions, setFitnessFunctions] = useState([]);
    const { t } = useTranslation();
    const themeContext = useContext(ThemeContext);
    const { fetch: fetchFitnessFunctions, loading: loadingFitnessFunctions } = useFetch();
    const [initialValues, setInitialValues] = useState({
        initial: {
            startDate: DateTime.now().minus({ years: 1, days: 1 }),
            endDate: DateTime.now().minus({ days: 1 }),
            timeframe: "1d",
            financialInstrumentName: "AAPL",
            benchmarkFinancialInstrumentName: "^GSPC",
            durationType: "years",
            durationAmount: 1,
            fitnessFunction: "",
            typeStartDate: "date",
            initialPortfolioValue: 500,
            riskFreeRate: 1,
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

    const loadFitnessFunctions = async () => {
        const result = await fetchFitnessFunctions({
            url: Endpoints.optimization.getFitnessFunctions,
            baseUrl: process.env.REACT_APP_BACKTESTER_ENGINE_URL,
            method: "GET"
        })
        setFitnessFunctions(result);
        setInitialValues({
            initial: { ...initialValues.initial, fitnessFunction: result[0] },
            additional: initialValues.additional
        })
    }
    useEffect(() => {
        themeContext.setTitle("backtester.strategyOptimizer", <ScienceOutlinedIcon />);
        loadFitnessFunctions()
    }, []);

    let validationSchema = Yup.object({
        startDate: Yup.date().required(),
        endDate: Yup.date().required(),
        financialInstrumentName: Yup.string().required(),
        benchmarkFinancialInstrumentName: Yup.string().required(),
    });

    const optimizeStrategyFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            ...initialValues.initial,
            ...initialValues.additional

        },
        onSubmit: async (values, formikBag) => {
            const payload = {
                static_parameters: {
                    fitness_function: values.fitnessFunction,
                    start_date: values.typeStartDate === "date" ?
                        values.startDate.set({ hours: 0, minutes: 0, seconds: 0 }).toMillis()
                        : values.endDate.set({ hours: 0, minutes: 0, seconds: 0 }).minus({ [values.durationType]: values.durationAmount }).toMillis(),
                    end_date: values.endDate.set({ hours: 0, minutes: 0, seconds: 0 }).toMillis(),
                    risk_free_rate: values.riskFreeRate / 100,
                    timeframe: values.timeframe,
                    financial_instrument_name: values.financialInstrumentName,
                    benchmark_financial_instrument_name: values.benchmarkFinancialInstrumentName,
                }
            }

            console.log(payload)
        },
        validationSchema,
        validate: async (values) => {
            //validationSchema.isValid(values).then((e) => validationTrigger ? setDisableButton(!e) : setDisableButton(true));
            //if (validationTrigger) validationSchema.isValid(values).then((e) => setDisableButton(!e));
        },
    });


    if (loadingFitnessFunctions) return <RoundLoader />;

    return (
        <div>
            <LoadingButton
                style={{ margin: "10px" }}
                size="large"
                loading={optimizeStrategyFormik.isSubmitting}
                endIcon={<UpdateOutlinedIcon />}
                type="submit"
                variant="contained"
                //disabled={disableButton}
                loadingPosition="end"
            >
                {t("backtester.optimizeStrategy")}
            </LoadingButton>
            <Typography variant="h5" gutterBottom align="center">
                {t("backtester.staticParameters")}
            </Typography>

            <div className="flex">
                <SelectFitnessFunction
                    formikInstance={optimizeStrategyFormik}
                    fitnessFunctions={fitnessFunctions}
                />
                <FinancialInstruments
                    formikInstance={optimizeStrategyFormik}
                />
                <Portfolio
                    formikInstance={optimizeStrategyFormik} />
                <ExogenVariables
                    formikInstance={optimizeStrategyFormik} />

            </div>
            <Divider variant="middle" />

            <Typography variant="h5" gutterBottom align="center" mt={2}>
                {t("backtester.parametersToOptimize")}
            </Typography>
            <Typography variant="h6" gutterBottom mt={2}>
                {t("backtester.portfolio")}
            </Typography>
            {/*<GenericCard title={t("backtester.staticInput")}>

            </GenericCard>
            <ParameterToOptimize
                formikInstance={optimizeStrategyFormik}
            />
    <Orders />*/}
        </div>
    );
}

export default StrategyOptimizer;
