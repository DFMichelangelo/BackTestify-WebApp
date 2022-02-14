import React, { useEffect, useContext, useState } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-monokai";
import Button from '@mui/material/Button';



function CreateStrategy(props) {
    const readTextFile = file => {
        let rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = () => {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status === 0) {
                    let allText = rawFile.responseText;
                    //console.log("allText: ", allText);
                    setStrategyCode(allText)
                }
            }
        };

        rawFile.send(null);
    };

    const themeContext = useContext(ThemeContext);
    const [strategyCode, setStrategyCode] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        themeContext.setTitle("backtester.createStrategy", <NoteAddOutlinedIcon />);
        readTextFile(process.env.PUBLIC_URL + "/input.txt");

    }, []);

    return (
        <div>
            <AceEditor
                mode="python"
                theme={themeContext.muiType === "light" ? "kuroir" : "monokai"}
                editorProps={{ $blockScrolling: true }}
                placeholder={t("backtester.createStrategy.placeholder")}
                fontSize={14}
                onChange={newValue => setStrategyCode(newValue)}
                name="UNIQUE_ID_OF_DIV"
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={strategyCode}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                }} />
            <Button variant="contained">{t("backtester.create_strategy")}</Button>
        </div>)
}

export default CreateStrategy;