import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import Fab from '@mui/material/Fab'
import './style.scss'
import { useTranslation } from "react-i18next";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useHistory } from "react-router-dom";


const FloatingActionButton = (props) => {
  const { color, icon, type, loading, success, disabled, tooltip, variant, className } = props
  const realDisabled = disabled || loading
  const history = useHistory();

  const handleOnClick = () => {
    const { onClick, href } = props
    if (typeof onClick === 'function') onClick()
    else if (href) history.push(href);
  }

  const button = <Fab variant={variant} color={color} type={type ? type : "button"} onClick={handleOnClick} disabled={realDisabled} className={success ? 'success' : ''}>
    {success ? <CheckOutlinedIcon id="checkOutlinedIcon" /> : icon}
  </Fab>

  return (
    <div className={'fabButton ' + className} >
      {tooltip && !realDisabled ?
        <Tooltip classes={{ tooltip: "tooltip" }} title={t(tooltip)} placement="top">{button}</Tooltip>
        :
        button
      }
      {loading && <CircularProgress size={68} className='progress' />}
    </div >
  )
}



FloatingActionButton.propTypes = {
  color: PropTypes.string,
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  success: PropTypes.bool,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.string,
  variant: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

FloatingActionButton.defaultProps = {
  color: 'primary',
  classes: {},
  disabled: false,
  href: "",
  loading: false,
  success: false,
  tooltip: "",
  type: "submit",
  icon: <AddOutlinedIcon />,
  variant: "round",
}


export default FloatingActionButton