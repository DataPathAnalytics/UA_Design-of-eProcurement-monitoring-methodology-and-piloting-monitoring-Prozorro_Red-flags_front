import React, {PropTypes, Component} from 'react'

export default class TreeMap extends Component {
    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        this.renderChart();
    }

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(this.props.data, nextProps.data)
    }

    render() {
        return (
            <div>
                <div className='chart' id={this.props.id}></div>
            </div>
        )
    }

    renderChart() {
        const {id} = this.props;
        $('#' + id).highcharts({
            chart: {

                backgroundColor: 'rgba(255, 255, 255, 0)'
            },
            colorAxis: {
                minColor: '#006064',
                maxColor: '#FFFFFF'
            },
            credits: {
                enabled: false
            },
            series: [{
                type: 'treemap',
                data: _.isNull(this.props.data) ? null : this.props.data.map((item, index) => {
                    return {name: item.description, value: item.tendersCount, colorValue: index}
                }),

            }],
            legend: {
                enabled: false
            },
            title: {
                text: ''
            }
        });
    }


}
TreeMap.propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.array
}