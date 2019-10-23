import React, {Component, PropTypes} from 'react';

export default class PieChart extends Component {
    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        this.renderChart();
    }

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(this.props.data, nextProps.data) || !_.isEqual(this.props.selectedPies, nextProps.selectedPies)
    }

    render() {
        return (
            <div>
                <div className='chart' id={this.props.id}></div>
            </div>
        )
    }

    renderChart() {
        const {id, onSegmentSelect, data, selectedPies} = this.props;
        const colorsDefalult = [
            'rgba(25, 121, 125, 1)',
            'rgba(25, 121, 125, 0.9)',
            'rgba(25, 121, 125, 0.8)',
            'rgba(25, 121, 125, 0.7)',
            'rgba(25, 121, 125, 0.6)',
            'rgba(25, 121, 125, 0.5)',
            'rgba(25, 121, 125, 0.4)',
            'rgba(25, 121, 125, 0.3)',
            'rgba(25, 121, 125, 0.2)',
            'rgba(25, 121, 125, 0.1)']
        let chartData = _.cloneDeep(data)
        let colors = _.isEmpty(selectedPies) ? colorsDefalult : chartData.map((item, index) => {
            return selectedPies.indexOf(item.name) !== -1 ? colorsDefalult[index] : '#c9c9c9'
        })
        $('#' + id).highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                backgroundColor: 'rgba(255, 255, 255, 0)'
            },
            title: {
                text: '',
                align: 'center',
                verticalAlign: 'middle',
                y: 40
            },
            tooltip: {
                pointFormat: '<b>{point.y} тендери - {point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    showInLegend: true,
                    dataLabels: {
                        enabled: false,
                        distance: -20,

                    }
                },
                series: {
                    point: {
                        events: {
                            click: function () {
                                if (!_.isUndefined(onSegmentSelect)) {
                                    let color = (this.color == '#c9c9c9') ? colors[_.findIndex(chartData, {name: this.name})] : '#c9c9c9';
                                    this.update({color: color});
                                    onSegmentSelect(this.name)
                                }

                            }
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },
            colors: colors,
            series: [{
                type: 'pie',
                name: null,
                data: chartData

            }]
        });
    }
}

PieChart.propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    onSegmentSelect: PropTypes.func,
    selectedPies: PropTypes.array
};