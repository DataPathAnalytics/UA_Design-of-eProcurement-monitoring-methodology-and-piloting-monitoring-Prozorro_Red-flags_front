import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Grid, Header, Segment} from 'semantic-ui-react';
import * as mainViewActions from 'actions/MainViewActions';
import PieChart from 'components/charts/PieChart';
import ColumnChart from 'components/charts/ColumnChart';
import BarChart from 'components/charts/BarChart';
import MapChart from 'components/charts/MapChart';
import {
    BUYERS_TENDERS_BY_INDICATORS,
    BUYERS_TENDERS_RISKS,
    PROCUREMENT_METHOD_TYPES,
    TENDERS_RISKS_BY_INDICATORS
} from 'constants/Urls';
import {PROCUREMENT_METHOD_TYPES_NAMES} from 'constants/Translations';
import {post} from 'helpers/http/Requests';
import SemanticLoader from 'components/common/Loader';


class MainView extends Component {

    state = {
        selected: null,
        filters: {
            procurentMethodTypes: [],
            buyersId: [],
            indicatorId: []
        }

    };

    componentWillMount() {
        post(PROCUREMENT_METHOD_TYPES, {}).then((result) => {
            this.props.mainViewActions.setTendersByProcurementMethodTypeLoading(false);
            this.props.mainViewActions.setTendersByProcurementMethodType(result.data.types)
        });
        post(TENDERS_RISKS_BY_INDICATORS, {}).then((result) => {
            this.props.mainViewActions.setTendersRisksByIndicatorsLoading(false);
            this.props.mainViewActions.setTendersRisksByIndicators(result.data.indicators)
        });
        post(BUYERS_TENDERS_RISKS, {}).then((result) => {
            this.props.mainViewActions.setBuyersTendersRisksLoading(false);
            this.props.mainViewActions.setBuyersTendersRisks(result.data.buyers)
        });
        post(BUYERS_TENDERS_BY_INDICATORS, undefined).then((result) => {
            this.props.mainViewActions.setBuyersTendersByIndicatorsLoading(false);
            this.props.mainViewActions.setBuyersTendersByIndicators(result.data.indicators)
        });
    }


    onFilterSelect(key, value) {

        let filters = _.clone(this.state.filters)
        if (filters[key].indexOf(value) == -1) {
            filters[key] = [value]
        } else {
            filters[key] = _.without(filters[key], value)
        }

        this.setState({filters: filters});
        this.props.mainViewActions.setTendersByProcurementMethodTypeLoading(true);
        this.props.mainViewActions.setTendersRisksByIndicatorsLoading(true);
        this.props.mainViewActions.setBuyersTendersRisksLoading(true);
        this.props.mainViewActions.setBuyersTendersByIndicatorsLoading(true);
        post(PROCUREMENT_METHOD_TYPES, _.omit(filters, 'procurentMethodTypes')).then((result) => {
            this.props.mainViewActions.setTendersByProcurementMethodTypeLoading(false);
            this.props.mainViewActions.setTendersByProcurementMethodType(result.data.types)
        });
        post(TENDERS_RISKS_BY_INDICATORS, _.omit(filters, 'indicatorId')).then((result) => {
            this.props.mainViewActions.setTendersRisksByIndicatorsLoading(false);
            this.props.mainViewActions.setTendersRisksByIndicators(result.data.indicators)
        });
        post(BUYERS_TENDERS_RISKS, _.omit(filters, 'buyersId')).then((result) => {
            this.props.mainViewActions.setBuyersTendersRisksLoading(false);
            this.props.mainViewActions.setBuyersTendersRisks(result.data.buyers)
        });
        post(BUYERS_TENDERS_BY_INDICATORS, undefined).then((result) => {
            this.props.mainViewActions.setBuyersTendersByIndicatorsLoading(false);
            this.props.mainViewActions.setBuyersTendersByIndicators(result.data.indicators)
        });

    }

    render() {
        let {tendersByProcurementMethodType, tendersRisksByIndicators, buyersTendersRisks, buyersTendersByIndicators} = this.props.mainViewReducer
        let alreadyUpload = true;
        Object.keys(this.props.mainViewReducer).map((key) => {
            if (_.isNull(this.props.mainViewReducer[key])) {
                alreadyUpload = false
            }
        });
        let alreadyUpdate = true;
        ['tendersByProcurementMethodTypeIsLoading', 'tendersRisksByIndicatorsIsLoading',
            'buyersTendersRisksIsLoading', 'buyersTendersByIndicatorsIsLoading'].map((key) => {
                if (this.props.mainViewReducer[key]) {
                    alreadyUpdate = false
                }
            }
        );

        let
            indicators = (_.isNull(tendersRisksByIndicators)) ? null : tendersRisksByIndicators.map((indicator) => {
                return indicator.code + '-' + indicator.description
            });
        let
            seriesByIndicators = (_.isNull(tendersRisksByIndicators)) ? null : [
                {
                    name: 'Тендери',
                    type: 'column',
                    colorByPoint: !_.isEmpty(this.state.filters.indicatorId),
                    legendColor: 'black',
                    data: tendersRisksByIndicators.map((indicator) => {
                        return indicator.tendersCount
                    })
                },
                {
                    legendColor: 'black',
                    name: 'Ризики',
                    colorByPoint: false,
                    color: '#006064',
                    type: 'spline',
                    data: tendersRisksByIndicators.map((indicator) => {
                        return indicator.riskSum
                    })
                }];

        return (
            <Segment className={'no-border'}>
                <SemanticLoader isDataLoading={!alreadyUpdate}/>
                <Grid stackable={true}>
                    { alreadyUpload ?
                        <Grid.Row columns={2} stackable={true}>
                            <Grid.Column width={5} className='large' textAlign='center'>
                                <Header disabled>Тендери за ризик індикаторами</Header>
                                {!_.isNull(indicators) &&
                                <BarChart
                                    id='indicators'
                                    title={''}
                                    onCategorySelect={(indicatorsName) => {
                                        let [code] = indicatorsName.split('-')

                                        this.onFilterSelect('indicatorId', code)
                                    }}
                                    categories={indicators}
                                    series={seriesByIndicators}
                                    selectedCategories={this.state.filters.indicatorId.map((indicator) => {
                                        let selected_category = tendersRisksByIndicators[_.findIndex(tendersRisksByIndicators, {code: indicator})]
                                        return selected_category.code + '-' + selected_category.description
                                    })}
                                />}
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <Grid stackable={true}>
                                    <Grid.Row stackable={true}>
                                        <Grid.Column textAlign='center'>
                                            <Header disabled>Кількість та вартість ризикових тендерів у ТОП 10 замовників за очікуваною вартістю</Header>
                                            <MapChart id='map' data={buyersTendersByIndicators}/>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row stackable={true} columns={2}>
                                        <Grid.Column width={6} textAlign='center'>
                                            <Header disabled>Кількість тендерів за методом
                                                закупівлі</Header>
                                            {!_.isNull(tendersByProcurementMethodType) &&
                                            <PieChart id='pie'
                                                      selectedPies={this.state.filters.procurentMethodTypes.map((item) => {
                                                          return PROCUREMENT_METHOD_TYPES_NAMES[item]
                                                      })}
                                                      onSegmentSelect={(procurentMethodType) => {
                                                          this.onFilterSelect('procurentMethodTypes', _.invert(PROCUREMENT_METHOD_TYPES_NAMES)[procurentMethodType])
                                                      }}
                                                      data={tendersByProcurementMethodType.map((item) => {
                                                          return {
                                                              name: PROCUREMENT_METHOD_TYPES_NAMES[item.procurementMethodType],
                                                              y: item.count
                                                          }
                                                      })}/>}
                                        </Grid.Column>
                                        <Grid.Column width={10} textAlign='center'>
                                            <Header disabled>Топ 10 за кількістю процедур</Header>
                                            <ColumnChart id='tender-by-ca-column'
                                                         title=''
                                                         onCategorySelect={(buyerName) => {
                                                             this.onFilterSelect('buyersId',
                                                                 buyersTendersRisks[_.findIndex(buyersTendersRisks, {name: buyerName})].id)
                                                         }}
                                                         selectedCategories={this.state.filters.buyersId.map((buyer) => {
                                                             return buyersTendersRisks[_.findIndex(buyersTendersRisks, {id: buyer})].name
                                                         })}
                                                         categories={buyersTendersRisks.map((buyer) => {
                                                             return buyer.name
                                                         })}
                                                         series={[
                                                             {
                                                                 name: 'Тендери',
                                                                 color: '#006064',
                                                                 data: buyersTendersRisks.map((buyer) => {
                                                                     return buyer.tendersCount
                                                                 })
                                                             },
                                                             {
                                                                 name: 'Ризики',
                                                                 color: '#9fc3c5',
                                                                 data: buyersTendersRisks.map((buyer) => {
                                                                     return buyer.risksCount
                                                                 })
                                                             }]}
                                            /></Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            Портал працює у пілотному режимі. Прохання надсилати всі зауваження на
                                            електронну адресу dozorro@ti-ukraine.org.
                                        </Grid.Column>
                                    </Grid.Row>

                                </Grid>
                            </Grid.Column>
                        </Grid.Row> : <SemanticLoader isDataLoading={true}/>}
                </Grid>
            </Segment>

        )
    }
}

function mapStateToProps(state) {
    return {
        mainViewReducer: state.mainViewReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mainViewActions: bindActionCreators(mainViewActions, dispatch),
    }

}
export default connect(mapStateToProps, mapDispatchToProps)(MainView);


