import React, { useEffect, useContext, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TableBody from "@mui/material/TableBody";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import classnames from "classnames";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import _ from "lodash"
import { Trans } from "react-i18next";
const useRowStyles = makeStyles((theme) => ({
  tableCell: {
    borderTop: "unset",
    borderBottom: "unset",
  },
  rowColor: {
    backgroundColor: theme.palette.mode == "light" ? "#FBFBFB" : "#666666",
  },
  root: {
    "& > *": {
      borderTop: "unset",
      borderBottom: "unset",
    },
  },
}));


const renderValueForCell = (element) => {
  if (typeof element.value === "boolean") return element.value === true ? (
    <CheckCircleOutlinedIcon className="trueIcon" />
  ) : (
    <CancelOutlinedIcon className="falseIcon" />
  );

  if (!isNaN(parseFloat(element.value))) {

    if (element.maxCharacters && element.value.length > element.maxCharacters) {
      const charactersBeforeDot = element.value.split(".")[0].length
      return parseFloat(element.value).toFixed(
        element.maxCharacters - charactersBeforeDot > 100 ? 100 : element.maxCharacters - charactersBeforeDot
      )
    }
    return element.value
  }
  if (typeof element.value === "string") {
    if (element.maxCharacters && element.value.length > element.maxCharacters) return element.value.slice(0, element.maxCharacters) + "[...]"
    return element.value
  }

}
const createTableCell = (element) => {

  let renderedElement = (
    <div className="singleCell"  >
      <span className="singleCellText" style={element.onClick && { cursor: "pointer" }} onClick={() => {
        if (element.onClick) return element.onClick()
        return
      }}>
        {element.component
          ?
          typeof element.component === 'function'
            ? element.component(`${renderValueForCell(element)} ${_.get("symbol", element, "")}`)
            : element.component
          : <>{renderValueForCell(element)}
            {element.symbol}</>}

      </span>
      {element.link && (
        <span className="singleCellIcon">

          <IconButton
            onClick={() => {
              window.open(element.link);
            }}
            className="linkIconButton"
          >
            <ChevronRightOutlinedIcon />
          </IconButton>
        </span>
      )}
    </div>
  );
  return renderedElement;
};

function Row(props) {
  const {
    readOnly,
    classes,
    activeCells,
    index,
    row,
    handleClick,
    isItemSelected,
    headCells,
    labelId,
    collapsible,
    collapsibleType,
    collapsibleHeadCells,
    collapsibleHeadIconsAndDescription,
    collapsibleTitle,
    showVerticalBorders,
    dense
  } = props;

  const themeContext = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const rowClasses = useRowStyles({ showVerticalBorders });

  return (
    <>
      <TableRow
        classes={{
          selected: classes.highlight,
        }}
        className={classnames(
          collapsible && rowClasses.root,
          index % 2 == 0 && rowClasses.rowColor
        )}
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={index}
        selected={isItemSelected}
      >
        {!readOnly && (
          <TableCell size="small" padding="checkbox">
            <Checkbox
              onClick={readOnly ? null : (event) => handleClick(event, row.id)}
              color="primary"
              checked={isItemSelected}
              inputProps={{ "aria-labelledby": labelId }}
            />
          </TableCell>
        )}

        {collapsible && (
          <TableCell>
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                setOpen(!open);
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}



        {headCells.map((element, index) => {
          return (
            element.show && (
              <TableCell
                padding={dense ? "none" : "normal"}
                key={row[element.id].value + index + element.id}
                align={index == 0 ? "inherit" : "center"}
                className={classnames(
                  row[element.id].link && index != 0 && "iconPadding",
                  (dense == true && index == 0 && readOnly == true) && "denseReadOnlyFirstItem",
                  (dense == true && index == headCells.length - 1 && readOnly == true) && "denseReadOnlyLastItem"
                )}
              >
                {createTableCell(row[element.id])}
              </TableCell>
            )
          );
        })}
      </TableRow>

      {(collapsible && collapsibleType == "INFORMATION") && (
        <TableRow>
          <TableCell
            style={{ paddingTop: 0, paddingBottom: 0 }}
            colSpan={activeCells + (readOnly ? 1 : 2)}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom>
                  <span className="font-semibold"><Trans>{collapsibleTitle}</Trans></span>
                </Typography>
                {collapsibleHeadIconsAndDescription.map(element => {
                  if (_.isEmpty(row.collapsible[element.id].value) && _.isEmpty(row.collapsible[element.id].component)) return
                  return (
                    <div key={element.id} className="mb-3">
                      <div className="flex mb-1">
                        {element.icon}
                        <Typography variant="body1">
                          <Trans>{element.label}</Trans>
                        </Typography>
                      </div>

                      <div className="ml-2 mr-2">{createTableCell(row.collapsible[element.id])}</div>

                    </div>
                  )

                })}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}

      {(collapsible && collapsibleType == "TABLE") && (
        <TableRow>
          <TableCell
            style={{ paddingTop: 0, paddingBottom: 0 }}
            colSpan={activeCells + (readOnly ? 1 : 2)}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom>
                  <span className="font-semibold"><Trans>{collapsibleTitle}</Trans></span>
                </Typography>
                <span className="collapsibleTable">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {collapsibleHeadCells.map((element, index) => {
                          return (
                            <TableCell
                              key={index}
                              align={index == 0 ? "left" : "center"}
                            >
                              <span className="font-semibold">
                                <Trans>{element.label}</Trans>
                              </span>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>

                      {collapsible &&
                        row.collapsible.map(
                          (collapsibleRow, collapsibleIndex) => {
                            return (
                              <TableRow key={collapsibleIndex}>
                                {collapsibleHeadCells.map(
                                  (
                                    collapsibleHeadCell,
                                    collapsibleHeadcellIndex
                                  ) => {
                                    return (
                                      <TableCell
                                        key={
                                          collapsibleRow[collapsibleHeadCell.id]
                                            .value +
                                          collapsibleIndex +
                                          collapsibleHeadcellIndex
                                        }
                                        align={
                                          collapsibleHeadcellIndex == 0
                                            ? "left"
                                            : "center"
                                        }
                                      >
                                        {createTableCell(
                                          collapsibleRow[collapsibleHeadCell.id]
                                        )}
                                      </TableCell>
                                    );
                                  }
                                )}
                              </TableRow>
                            );
                          }
                        )}
                    </TableBody>
                  </Table>
                </span>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default Row;
