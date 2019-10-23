import React, {PropTypes, Component} from 'react'
export default class AreaChart extends Component {
    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        this.renderChart();
    }

    render() {
        return (
            <div>
                <div className='chart' id={this.props.id}></div>
            </div>
        )
    }


    renderChart() {


        $('#' + this.props.id).highcharts({
            chart: {
                type: 'areaspline',
                backgroundColor: 'rgba(255, 255, 255, 0)'
            },
            title: {
                text: 'Tenders by date',

                style: {
                    color: '#6e6e6e'
                }

            },

            xAxis: {
                categories: this.props.categories,
                crosshair: true,
                labels: {
                    style: {
                        color: '#6e6e6e'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                line: {}
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            series: this.props.series
        });
    }

}
AreaChart.propTypes = {
    id: PropTypes.string.isRequired,
    categories: PropTypes.array.isRequired,
    series: PropTypes.array.isRequired
}