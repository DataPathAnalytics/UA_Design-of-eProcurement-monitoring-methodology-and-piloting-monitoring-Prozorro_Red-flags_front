import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as tendersActions from 'actions/TendersActions'
import * as filtersActions from 'actions/FiltersActions'
import {Grid, Segment} from 'semantic-ui-react'
import TendersTable from 'components/common/TendersTable';
import Filter from 'components/common/Filter';
import {post, get} from 'helpers/http/Requests'
import {
    FILTER_PROCUREMENT_METHOD_TYPES,
    BUYERS,
    REGIONS,
    CPV,
    INDICATORS,
    TENDERS_TABLE,
    RISKS_SUM
} from 'constants/Urls'
import SemanticLoader from 'components/common/Loader';
import {PROCUREMENT_METHOD_TYPES_NAMES} from 'constants/Translations'

class Tenders extends Component {
    state = {
        selected: null,
        filters: {
            buyers: [],
            page: 1,
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
        post(TENDERS_TABLE, this.state.filters).then((result) => {
            this.props.tendersActions.setTableLoading(false);
            this.props.tendersActions.setTendersTable(result.data.tenders);
            this.props.tendersActions.setMaxPage(result.data.pages)
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(prevState.filters, this.state.filters)) {
            post(FILTER_PROCUREMENT_METHOD_TYPES, _.omit(this.state.filters, 'procurentMethodTypes')).then((result) => {
                this.props.filtersActions.setProcurementMethodType(result.data.procurementMethodTypes)
            });
            post(BUYERS, _.omit(this.state.filters, 'buyers')).then((result) => {
                this.props.filtersActions.setBuyers(result.data.buyers)
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
            this.props.tendersActions.setTableLoading(true)
            post(TENDERS_TABLE, this.state.filters).then((result) => {
                this.props.tendersActions.setTableLoading(false);
                this.props.tendersActions.setTendersTable(result.data.tenders);
                this.props.tendersActions.setMaxPage(result.data.pages)
            })
        }
        if (!_.isEqual(prevState.selected, this.state.selected)) {
            this.props.tendersActions.setTenderTable(null)
            get(TENDERS_TABLE + this.state.selected + '/indicators').then((result) => {
                this.props.tendersActions.setTenderTable(result.data.indicators)
            })
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
        let {regions, buyers, cpv, procurementMethodType, indicators, risksSum} = this.props.filtersReducer;
        let {tendersTable, tenderTable, maxPage, tableLoading} = this.props.tendersReducer;
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
            <Segment className={'no-border' + (tableLoading ? ' table-load' : '')}>
                <SemanticLoader isDataLoading={!alreadyUpload || tableLoading}/>
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
                        indicators={indicators.map((item) => {
                            return {key: item.code, value: item.code, text: item.description}
                        })}
                        procurementMethodType={_.isNull(procurementMethodType) ? null : procurementMethodType.map((item) => {
                            return {
                                key: item.procurementMethodType,
                                value: item.procurementMethodType,
                                text: PROCUREMENT_METHOD_TYPES_NAMES[item.procurementMethodType]
                            }
                        })}/>
                    <Grid.Row stackable>
                        <Grid.Column className='large'>
                            <TendersTable
                                header={[]}
                                data={tendersTable}
                                isDataLoading={tableLoading}
                                maxPage={maxPage}
                                onTenderSelect={(tenderId) => this.onTenderSelect(tenderId)}
                                currentPage={this.state.filters.page}
                                selectedTender={this.state.selected}
                                selectedTenderIndicators={tenderTable}
                                onPageChange={(page) => {
                                    this.setTablePage(page)
                                }}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>

        )
    }
}

function mapStateToProps(state) {
    return {
        mainViewReducer: state.mainViewReducer,
        filtersReducer: state.filtersReducer,
        tendersReducer: state.tendersReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        tendersActions: bindActionCreators(tendersActions, dispatch),
        filtersActions: bindActionCreators(filtersActions, dispatch),
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(Tenders);


