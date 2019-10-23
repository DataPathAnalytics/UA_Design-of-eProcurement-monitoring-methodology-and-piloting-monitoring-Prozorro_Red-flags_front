import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as heatMapActions from 'actions/HeatMapActions'
import * as filtersActions from 'actions/FiltersActions'
import {Grid} from 'semantic-ui-react'
import Filter from 'components/common/Filter';
import {post} from 'helpers/http/Requests'
import {
    FILTER_PROCUREMENT_METHOD_TYPES,
    BUYERS,
    REGIONS,
    CPV,
    INDICATORS,
    BUYERS_TENDERS_BY_INDICATORS,
    RISKS_SUM
} from 'constants/Urls'
import SemanticLoader from 'components/common/Loader';
import {PROCUREMENT_METHOD_TYPES_NAMES} from 'constants/Translations'
import MapChart from 'components/charts/MapChart';

class HeatMapView extends Component {
    state = {
        filters: {
            buyers: [],
            regions: [],
            date: '',
            maxAmount: null,
            minAmount: null,
            cpv: [],
            procurentMethodTypes: [],
            indicatorId: [],
            risksSum: []
        }

    };

    onTenderSelect(tenderId) {
        this.setState({selected: tenderId})
    }


    setTablePage(page) {
        let filters = _.clone(this.state.filters);
        filters.page = page;
        this.setState({filters: filters})
    }

    componentWillMount() {
        post(FILTER_PROCUREMENT_METHOD_TYPES, {}).then((result) => {
            this.props.filtersActions.setProcurementMethodType(result.data.procurementMethodTypes)
        });
        post(BUYERS, {}).then((result) => {
            this.props.filtersActions.setBuyers(result.data.buyers)
        });
        post(REGIONS, {}).then((result) => {
            this.props.filtersActions.setRegions(result.data.regions)
        });
        post(CPV, {}).then((result) => {
            this.props.filtersActions.setCPV(result.data.cpvs)
        });
        post(INDICATORS, {}).then((result) => {
            this.props.filtersActions.setIndicators(result.data.indicators)
        });
        post(RISKS_SUM, {}).then((result) => {
            this.props.filtersActions.setRisksSum(result.data.risks)
        });
        post(BUYERS_TENDERS_BY_INDICATORS, undefined).then((result) => {
            this.props.heatMapActions.setHeatMapDataLoading(false);
            this.props.heatMapActions.setHeatMapData(result.data.indicators);
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevState.filters, this.state.filters)) {
            post(FILTER_PROCUREMENT_METHOD_TYPES, _.omit(this.state.filters, 'procurentMethodTypes')).then((result) => {
                this.props.filtersActions.setProcurementMethodType(result.data.procurementMethodTypes)
            });
            post(BUYERS, _.omit(this.state.filters, 'buyers')).then((result) => {
                this.props.filtersActions.setBuyers(result.data.buyers)

                let filter = _.cloneDeep(this.state.filters)
                filter['buyers'] = _.isEmpty(filter.buyers) ? result.data.buyers.map((buyer) => {
                    return buyer.id
                }).slice(0, 10) : filter.buyers
                this.props.heatMapActions.setHeatMapDataLoading(true)
                post(BUYERS_TENDERS_BY_INDICATORS, filter).then((result) => {
                    this.props.heatMapActions.setHeatMapDataLoading(false);
                    this.props.heatMapActions.setHeatMapData(result.data.indicators);
                })
            });
            post(REGIONS, _.omit(this.state.filters, 'regions')).then((result) => {
                this.props.filtersActions.setRegions(result.data.regions)
            });
            post(CPV, _.omit(this.state.filters, 'cpv')).then((result) => {
                this.props.filtersActions.setCPV(result.data.cpvs)
            });
            post(INDICATORS, _.omit(this.state.filters, 'indicatorId')).then((result) => {
                this.props.filtersActions.setIndicators(result.data.indicators)
            });
            post(RISKS_SUM, _.omit(this.state.filters, 'risksSum')).then((result) => {
                this.props.filtersActions.setRisksSum(result.data.risks)
            });

        }

    }

    onFilterChange(key, values) {
        let filters = _.clone(this.state.filters)
        if (!_.isEqual(filters[key], values)) {
            filters[key] = values
            filters['page'] = 1
            this.setState({selected: null, filters: filters})
        }
    }

    render() {
        let {regions, buyers, cpv, procurementMethodType, risksSum} = this.props.filtersReducer;
        let {heatMapData, heatMapDataIsLoading} = this.props.heatMapReducer;
        let alreadyUpload = true;
        Object.keys(this.props.filtersReducer).map((key) => {
            if (_.isNull(this.props.filtersReducer[key])) {
                alreadyUpload = false
            }
        });
        if (!alreadyUpload) {
            return <Grid stackable><SemanticLoader isDataLoading={true}/></Grid>
        }
        return (

            <Grid stackable>
                <Filter
                    filter={this.state.filters}
                    onFiltersChange={(key, values) => {
                        this.onFilterChange(key, values)
                    }}
                    regions={regions.map((region) => {
                        return {key: region.id, value: region.id, text: region.name}
                    })}
                    buyers={buyers.map((buyer) => {
                        return {key: buyer.id, value: buyer.id, text: buyer.name}
                    })}
                    risks={risksSum.map((risk) => {
                        return {key: risk.sum, value: risk.sum, text: risk.sum}
                    })}
                    cpv={cpv.map((item) => {
                        return {key: item.code, value: item.code, text: item.name}
                    })}
                    allowMultipleBuyer={true}
                    procurementMethodType={_.isNull(procurementMethodType) ? null : procurementMethodType.map((item) => {
                        return {
                            key: item.procurementMethodType,
                            value: item.procurementMethodType,
                            text: PROCUREMENT_METHOD_TYPES_NAMES[item.procurementMethodType]
                        }
                    })}/>
                <Grid.Row stackable>
                    <Grid.Column>
                        {heatMapDataIsLoading ? <Grid><SemanticLoader isDataLoading={true}/></Grid> :
                            <MapChart id='map' data={heatMapData}/>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        )
    }
}

function mapStateToProps(state) {
    return {
        mainViewReducer: state.mainViewReducer,
        filtersReducer: state.filtersReducer,
        heatMapReducer: state.heatMapReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        heatMapActions: bindActionCreators(heatMapActions, dispatch),
        filtersActions: bindActionCreators(filtersActions, dispatch),
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(HeatMapView);


