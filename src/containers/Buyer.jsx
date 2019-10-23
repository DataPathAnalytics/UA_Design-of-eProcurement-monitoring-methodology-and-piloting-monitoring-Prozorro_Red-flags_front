import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as buyerActions from 'actions/BuyerActions'
import * as filtersActions from 'actions/FiltersActions'
import {Divider, Grid, Image, Header} from 'semantic-ui-react';
import TreeMap from 'components/charts/TreeMap';
import ColumnChart from 'components/charts/ColumnChart';
import PieChart from 'components/charts/PieChart';
import Filter from 'components/common/Filter';
import {
  PROCUREMENT_METHOD_TYPES, BUYERS, TENDERS_BY_CPV, BUYERS_INDICATORS, BUYER_INFO, FILTER_PROCUREMENT_METHOD_TYPES,
  CPV, INDICATORS
} from 'constants/Urls'
import {PROCUREMENT_METHOD_TYPES_NAMES} from 'constants/Translations'
import {post, get} from 'helpers/http/Requests'

import Loader from 'components/common/Loader';

class Buyer extends Component {
  state = {
    selected: null,
    filter: {
      buyersId: [this.props.buyerId],
      buyers: [this.props.buyerId],
      date: '',
      maxAmount: null,
      minAmount: null,
      cpv: [],
      procurentMethodTypes: [],
      indicatorId: []
    }
  };

  onFilterChange(key, values) {
    let filters = _.clone(this.state.filter)
    if (!_.isEqual(filters[key], values)) {
      filters[key] = values
      this.setState({filter: filters})
    }
    this.props.buyerActions.setBuyerTendersByProcurementMethodType(null);
    this.props.buyerActions.setBuyerTendersByCPV(null);
    this.props.buyerActions.setBuyerIndicators(null);
    post(PROCUREMENT_METHOD_TYPES, filters).then((result) => {
      this.props.buyerActions.setBuyerTendersByProcurementMethodType(result.data.types)
    });
    post(TENDERS_BY_CPV, filters).then((result) => {
      this.props.buyerActions.setBuyerTendersByCPV(result.data.cpvs)
    });
    post(BUYERS_INDICATORS, filters).then((result) => {
      this.props.buyerActions.setBuyerIndicators(result.data.indicators)
    });
  }

  componentWillMount() {
    get(BUYER_INFO + this.props.buyerId).then((result) => {
      let buyer = result.data
      let filter = _.cloneDeep(this.state.filter)
      filter.buyersId = [buyer.id]
      filter.buyers = [buyer.id]

      this.props.buyerActions.setBuyerInfo(buyer)
      post(BUYERS, {}).then((result) => {
        this.props.filtersActions.setBuyers(result.data.buyers)
      });
      post(FILTER_PROCUREMENT_METHOD_TYPES, {buyers: [buyer.id]}).then((result) => {
        this.props.filtersActions.setProcurementMethodType(result.data.procurementMethodTypes)
      });
      post(CPV, {buyers: [buyer.id]}).then((result) => {
        this.props.filtersActions.setCPV(result.data.cpvs)
      });
      post(INDICATORS, {buyers: [buyer.id]}).then((result) => {
        this.props.filtersActions.setIndicators(result.data.indicators)
      });

      post(PROCUREMENT_METHOD_TYPES, filter).then((result) => {
        this.props.buyerActions.setBuyerTendersByProcurementMethodType(result.data.types)
      });
      post(TENDERS_BY_CPV, filter).then((result) => {
        this.props.buyerActions.setBuyerTendersByCPV(result.data.cpvs)
      });
      post(BUYERS_INDICATORS, filter).then((result) => {
        this.props.buyerActions.setBuyerIndicators(result.data.indicators)
      });
      this.setState({filter: filter})
    })

  }

  render() {
    let {cpv, buyers, procurementMethodType, indicators} = this.props.filtersReducer;
    let {buyerTendersByProcurementMethodType, buyerTendersByCPV, buyerIndicators, buyerInfo} = this.props.buyersReducer;
    let filtersUpload = true;
    let chartsUpload = true;
    [cpv, buyers, procurementMethodType, indicators].map((item) => {
      if (_.isNull(item)) {
        filtersUpload = false
      }
    });
    Object.keys(this.props.buyersReducer).map((key) => {
      if (_.isNull(this.props.buyersReducer[key])) {
        chartsUpload = false
      }
    });
    if (!filtersUpload) {
      return <Grid stackable><Loader/></Grid>
    }
    return <Grid stackable={true}>
      <Divider horizontal>{buyerInfo.name}</Divider>
      <Filter

        cpv={cpv.map((item) => {
          return {key: item.code, value: item.code, text: item.name}
        })}
        indicators={indicators.map((item) => {
          return {key: item.code, value: item.code, text: item.description}
        })}
        buyers={buyers.map((buyer) => {
          return {key: buyer.outerId, value: buyer.outerId, text: buyer.name}
        })}
        selectedBuyer={{key: buyerInfo.id, value: buyerInfo.id, text: buyerInfo.name}}
        allowMultipleBuyer={false}
        onFiltersChange={(key, values) => {
          this.onFilterChange(key, values)
        }}
        procurementMethodType={_.isNull(procurementMethodType) ? null : procurementMethodType.map((item) => {
          return {
            key: item.procurementMethodType,
            value: item.procurementMethodType,
            text: PROCUREMENT_METHOD_TYPES_NAMES[item.procurementMethodType]
          }
        })}/>
      {chartsUpload &&
      (_.isEmpty(buyerTendersByProcurementMethodType) && _.isEmpty(buyerTendersByCPV) && _.isEmpty(buyerIndicators)) ?
        < Image className={'noData'} src='/static/images/no_data.png'/> : <Grid.Row>
          <Grid.Column textAlign='center'>
            <Header disabled>Кількість тендерів за індикаторами</Header>
            <TreeMap id='tree' data={buyerIndicators}/>
          </Grid.Column>
        </Grid.Row>}
      {chartsUpload &&
      (_.isEmpty(buyerTendersByProcurementMethodType) && _.isEmpty(buyerTendersByCPV) && _.isEmpty(buyerIndicators)) ?
        null : <Grid.Row columns='equal'>
          <Grid.Column textAlign='center'>
            <Header disabled>Кількість тендерів по методу закупівлі</Header>
            {!_.isNull(buyerTendersByProcurementMethodType) &&
            <PieChart id='pie'
                      selectedPies={[]}
                      data={buyerTendersByProcurementMethodType.map((item) => {
                        return {
                          name: PROCUREMENT_METHOD_TYPES_NAMES[item.procurementMethodType],
                          y: item.count
                        }
                      })}/>}
          </Grid.Column>
          <Grid.Column textAlign='center'>
            <Header disabled>Кількість тендерів за CPV</Header>

            <ColumnChart id='tender-by-ca-column'
                         title=''
                         selectedCategories={[]}
                         categories={buyerTendersByCPV.map((item) => {
                           return item.cpv
                         })}
                         series={[{
                           name: 'Тендери',
                           data: buyerTendersByCPV.map((item) => {
                             return item.tendersCount
                           }),
                           color: '#006064'
                         },
                           {
                             name: 'Ризики',
                             data: buyerTendersByCPV.map((item) => {
                               return item.risksCount
                             }),
                             color: '#00b2b0'
                           }]}
            />
          </Grid.Column>
        </Grid.Row>}
    </Grid>

  }
}
Buyer.propTypes = {
  buyerId: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    buyersReducer: state.buyersReducer,
    filtersReducer: state.filtersReducer,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    buyerActions: bindActionCreators(buyerActions, dispatch),
    filtersActions: bindActionCreators(filtersActions, dispatch),
  }

}
export default connect(mapStateToProps, mapDispatchToProps)(Buyer);


