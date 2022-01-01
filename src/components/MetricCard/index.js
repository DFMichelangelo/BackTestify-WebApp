import Card from '@mui/material/Card';
import PropTypes from 'prop-types';

function MetricCard(props) {
    const { title, subtitle, metricValue } = props;
    return (
        <Card sx={{ width: "fit-content", padding: "15px" }}>
            <Typography variant="subtitle1">
                <span style={{
                    fontWeight: "bold",
                }}>
                    {title}
                </span>
            </Typography>
            <Typography variant="overline" gutterBottom >
                <span style={{
                    color: "rgb(100, 100, 100)",
                }}>
                    {subtitle}
                </span>
            </Typography>
            <Typography variant="h6" >
                <span style={{
                    fontWeight: "semi-bold",
                }}>
                    {metricValue}
                </span>
            </Typography>
        </Card>
    )
}
export default MetricCard