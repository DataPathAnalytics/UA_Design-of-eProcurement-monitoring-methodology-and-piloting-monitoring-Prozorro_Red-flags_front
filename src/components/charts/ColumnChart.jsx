import React, {PropTypes, Component} from 'react'
export default class ColumnChart extends Component {
    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate() {
        this.renderChart();
    }

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(this.props.series, nextProps.series) ||
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
        let {id, series, categories, selectedCategories, onCategorySelect} = this.props;
        let colors = ['#006064', '#9fc3c5']
        let selectionColors = ['#c9c9c9', '#595959']
        let chartSeries = _.cloneDeep(series)
        let chartCategories = _.cloneDeep(categories)
        chartSeries.map((serie, index) => {
            serie['colorByPoint'] = true;
            serie['colors'] = chartCategories.map((item) => {
                return selectedCategories.indexOf(item) !== -1 ? selectionColors[index] : colors[index]
            });
        });
        $('#' + id).highcharts({
            chart: {
                type: 'column',
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
                },
                title: null
            },
            yAxis: {
                title: null
            },

            tooltip: {
                shared: true,
                formatter: function () {

                    return this.points.map((item) => {
                        return '<p style="color:' + item.color + '">' + item.series.name + ':' + item.y + '</p><br/>'
                    })
                }
            },
            plotOptions: {
                column: {
                    borderColor: 'rgba(255, 143, 66, 0)',
                    // colorByPoint: true,
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
ColumnChart.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    categories: PropTypes.array.isRequired,
    series: PropTypes.array.isRequired,
    selectedCategories: PropTypes.array,
    onCategorySelect: PropTypes.func
};