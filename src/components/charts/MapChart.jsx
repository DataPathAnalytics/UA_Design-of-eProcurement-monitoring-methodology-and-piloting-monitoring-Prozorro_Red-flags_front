import React, {PropTypes, Component} from 'react'
import {Radio} from 'semantic-ui-react';
var numeral = require('numeral');

export default class MapChart extends Component {
    state = {active: 'tendersCount'}

    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        this.renderChart();
    }

    handleRadioChange() {
        this.setState({active: _.isEqual(this.state.active, 'tendersCount') ? 'amount' : 'tendersCount'})
    }

    render() {
        return (
            <div>
                <div className='toggle-heatmap'>
                    <span>Кількість тендерів</span>
                    <Radio slider onClick={this.handleRadioChange.bind(this)}/>
                    <span>Очікувана вартість</span>
                </div>
                <div className='chart' id={this.props.id}></div>
            </div>
        )
    }


    renderChart() {
        let {id, data} = this.props;

        let buyers = _.uniq(_.map(data, 'buyerName'));
        let indicators = _.uniq(_.map(data, 'indicator'));
        let dataset = []
        _.forEach(indicators, (indicator) => {
            _.forEach(buyers, (buyer) => {
                let index = _.findIndex(data, {'indicator': indicator, 'buyerName': buyer})
                dataset.push([indicators.indexOf(indicator), buyers.indexOf(buyer), index == -1 ? 0 : data[index][this.state.active]])
            })
        });
        let indicatorsWithCode = indicators.map((indicator) => {
            let index = _.findIndex(data, {'indicator': indicator})
            return data[index].indicatorCode + '-' + data[index].indicator
        })

        $('#' + id).highcharts({
            chart: {
                type: 'heatmap',
                marginTop: 10,
                marginBottom: 120,
                plotBorderWidth: 1,
                backgroundColor: 'rgba(255, 255, 255, 0)'
            },


            title: {
                text: ''
            },

            xAxis: {
                title: null,
                categories: indicatorsWithCode,
                labels: {
                    rotation: -30
                }
            },

            yAxis: {
                categories: buyers,
                title: null
            },

            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: '#006064'
            },

            legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                symbolHeight: 280
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                heatmap: {
                    borderColor: 'RGBA(0,0,0,0.3)',
                    dataLabels: {
                        style: {
                            color: '#636363',
                            fontSize: '9.4px',
                            fontWeight: 'normal',
                            textOutline: '0px contras'
                        },
                        formatter: function () {
                            return numeral(this.point.value).format('0.[0]a')
                        }
                    }
                }
            },
            tooltip: {
                enabled: false
            },
            series: [{
                name: 'Тендери',
                borderWidth: 1,
                data: dataset,
                dataLabels: {
                    enabled: true,
                    color: '#636363'
                }
            }]
        });
    }

}
MapChart.propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.array

};