import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import classnames from "classnames";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { makeStyles } from "@mui/styles";
import { Trans } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  topTableCell: {
    borderTop: "unset",
    borderBottom: "unset",
  },
}));

function EnhancedTableHead(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const themeContext = useContext(ThemeContext);
  const [popoverHelpText, setPopoverHelpText] = useState(null);
  const headClasses = useStyles();
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
    readOnly,
    collapsible,
    dense
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const handleClick = (event, helperText) => {
    setAnchorEl(event.currentTarget);
    setPopoverHelpText(<Trans>{helperText}</Trans>);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <TableHead>
      <TableRow
        className={classnames(
          themeContext.muiType === "light" ? "lightHeader" : "darkHeader"
        )}
      >
        {!readOnly && (
          <TableCell classes={{ root: headClasses.topTableCell }} padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}
        {collapsible && <TableCell />}

        {headCells.map(
          (headCell, index) =>
            headCell.show && (
              <TableCell
                padding={dense ? "none" : "normal"}
                size="small"
                key={headCell.id + index}
                align={index === 0 ? "left" : "center"}
                sortDirection={orderBy === headCell.id ? order : false}
                classes={{ root: headClasses.topTableCell }}
                className={classnames(
                  (dense == true && index == 0 && readOnly == true) && "denseReadOnlyFirstItem"
                )}
              >
                <span
                  className={classnames(
                    index != 0 &&
                    (headCell.helpText
                      ? "headRowWithHelperText"
                      : "headRowWithoutHelperText")
                  )}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    <Typography color="textSecondary" variant="body1">
                      {headCell.label}
                    </Typography>
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </span>
                    ) : null}
                  </TableSortLabel>

                  {headCell.helpText && (
                    <>
                      <Popover
                        elevation={1}
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <Typography className="p-3">
                          {popoverHelpText}
                        </Typography>
                      </Popover>
                      <IconButton
                        onClick={(event) => {
                          handleClick(event, headCell.helpText);
                        }}
                      >
                        <HelpOutlinedIcon color="disabled" fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </span>
              </TableCell>
            )
        )}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default EnhancedTableHead;
