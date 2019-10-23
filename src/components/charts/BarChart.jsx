import React, {PropTypes, Component} from 'react'
export default class BarChart extends Component {
    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        this.renderChart();
    }

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(JSON.stringify(this.props.series).replace(',"_symbolIndex":0', ''),
                JSON.stringify(nextProps.series).replace(',"_symbolIndex":0', '')) ||
            !_.isEqual(this.props.selectedCategories, nextProps.selectedCategories)
    }

    render() {
        return (
            <div>
                <div className='chart' id={this.props.id}></div>
            </div>
        )
    }


    renderChart() {

        let {id, onCategorySelect, categories, series, selectedCategories} = this.props
        let chartCategories = _.cloneDeep(categories)
        let chartSeries = _.cloneDeep(series)
        let colors = _.isEmpty(selectedCategories) ? chartCategories.map(() => {
            return '#9fc3c5'
        }) : chartCategories.map((item) => {
            return selectedCategories.indexOf(item) !== -1 ? '#9fc3c5' : '#c9c9c9'
        });
        $('#' + id).highcharts({
            chart: {
                type: 'bar',
                backgroundColor: 'rgba(255, 255, 255, 0)'
            },

            title: {
                text: this.props.title,
                style: {
                    color: '#6e6e6e'
                }
            },

            xAxis: {
                categories: chartCategories,
                crosshair: true,
                labels: {
                    style: {
                        color: '#6e6e6e'
                    }
                }
            },
            colors: ['#9fc3c5', '#006064'],

            tooltip: {

                shared: true,
                formatter: function () {
                    let tenders = 0;
                    let risks = 0;
                    let tooltip = this.points.map((item) => {

                        let name = item.series.name;
                        let value = item.y;
                        if (_.isEqual(name, 'Тендери')) {
                            tenders = item.y
                        } else {
                            if (_.isEqual(name, 'Ризики')) {
                                risks = item.y
                            }
                        }
                        return '<p style="color:' + item.color + '">' + name + ':' + value + '</p><br/>'

                    })
                    tooltip.push('<p>Частка ризиків:' + _.round((risks / tenders) * 100, 3) + '%</p><br/>')
                    return tooltip
                }

                // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                // pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
                // '<td style="padding:0"><b>{point.y}</b></td></tr>',
                // footerFormat: '</table>',
                // shared: true,
                // useHTML: true
            },

            plotOptions: {
                column: {
                    borderColor: 'rgba(255, 143, 66, 0)',
                    colorByPoint: true,
                    colors: colors,
                },
                series: {
                    pointPadding: -0.1,
                    point: {
                        events: {
                            click: function () {
                                if (!_.isUndefined(onCategorySelect)) {
                                    let color = (this.color == '#c9c9c9') ? '#9fc3c5' : '#c9c9c9';
                                    this.update({color: color});
                                    onCategorySelect(this.category)
                                }
                            }
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: true
            },
            series: chartSeries
        });
    }

}
BarChart.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    categories: PropTypes.array.isRequired,
    series: PropTypes.array.isRequired,
    onCategorySelect: PropTypes.func,
    selectedCategories: PropTypes.array
};