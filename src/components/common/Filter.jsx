import {Component, PropTypes} from 'react'
import {Grid, Dropdown, Popup, Button, Input} from 'semantic-ui-react'
import MonthPicker from 'react-simple-month-picker';
import {BUYERS} from 'constants/Urls'
import {post} from 'helpers/http/Requests'

export default class Filter extends Component {
  state = {
    buyers: this.props.buyers,
    date: null,
    selectedBuyers: _.isUndefined(this.props.selectedBuyer) ? [] : [this.props.selectedBuyer],
    selectedLocation: null,
    selectedCPV: null,
    selectedProcurementMethodType: null,
    isDateOpen: false,
    isMinMaxOpen: false,
    minAmount: '',
    maxAmount: ''
  };

  onBuyerSearchChange(event, target) {
    if (!_.isEmpty(target)) {
      let filter = _.cloneDeep(this.props.filter)
      filter['buyerNameSubstring'] = target
      filter['buyers'] = [],
        post(BUYERS, filter).then((result) => {
          this.setState({
            buyers: _.isEmpty(result.data.buyers) ? this.state.selectedBuyers : result.data.buyers.map((buyer) => {
              return {key: buyer.id, value: buyer.id, text: buyer.name}
            }).concat(this.state.selectedBuyers)
          })
        });
    } else {
      this.setState({buyers: this.props.buyers})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.buyers, this.state.buyers)) {
      this.setState({buyers: nextProps.buyers})
    }
  }

  onSelect(dropdown, event, target) {
    switch (dropdown) {
      case 'selectedBuyers':
        if (_.isEqual(this.props.allowMultipleBuyer, false)) {
          window.location = '/buyer/' + target.value
        }
        else {
          this.setState({
            selectedBuyers: this.state.buyers.filter((buyer) => {
              return target.value.indexOf(buyer.key) != -1
            })
          });
          this.props.onFiltersChange('buyers', target.value)
        }
        break;
      case 'cpv':
        this.props.onFiltersChange(dropdown, target.value.map((item) => {
          return item.slice(0, 2)
        }))
        break;
      default:
        this.props.onFiltersChange(dropdown, target.value)

    }
  }

  handleDateOpen = () => {
    this.setState({isDateOpen: true})
  };
  handleDatePopupByButton = () => {
    this.setState({isDateOpen: !this.state.isDateOpen})
  };
  handleMinMaxPopup = () => {
    this.setState({isMinMaxOpen: !this.state.isMinMaxOpen})
  };
  handleMinMaxAmount = () => {
    this.setState({isMinMaxOpen: !this.state.isMinMaxOpen})
    this.props.onFiltersChange('minAmount', _.isEmpty(this.state.minAmount) ? null : this.state.minAmount)
    this.props.onFiltersChange('maxAmount', _.isEmpty(this.state.maxAmount) ? null : this.state.maxAmount)

  };
  onInputChange = (field, event, target) => {
    this.setState({[field]: target.value})
  };
  closePopups = () => this.setState({isDateOpen: false, isMinMaxOpen: false})

  render() {
    let {regions, cpv, procurementMethodType, indicators, risks} = this.props;
    let monthNames = [
      'Cічень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень',
      'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
    ];

    let self = this;
    return (
      <Grid.Row className='filter' columns={Object.keys(this.props).length > 4 ? 4 : 'equal'} stackable>
        {!_.isUndefined(indicators) && <Grid.Column>
          <Dropdown fluid multiple selection
                    placeholder='Оберіть індикатор'
                    options={indicators}
                    search={true}
                    closeOnChange={true}
                    onChange={this.onSelect.bind(this, 'indicatorId')}
                    onOpen={this.closePopups.bind(this)}
                    textAlign='center'
                    minCharacters={0}/>
        </Grid.Column>
        }
        {!_.isUndefined(this.state.buyers) && <Grid.Column>
          <Dropdown fluid selection
                    placeholder='Оберіть замовника '
                    options={_.extend(this.state.buyers, this.state.selectedBuyers)}
                    search={true}
                    multiple={!_.isEqual(this.props.allowMultipleBuyer, false)}
                    closeOnChange={true}
                    onSearchChange={this.onBuyerSearchChange.bind(this)}
                    noResultsMessage={null}
                    defaultValue={_.isUndefined(this.props.selectedBuyer) ? null : this.props.selectedBuyer.key}
                    onChange={this.onSelect.bind(this, 'selectedBuyers')}
                    onOpen={this.closePopups.bind(this)}
                    minCharacters={0}/>
        </Grid.Column>}
        {!_.isUndefined(regions) && <Grid.Column>
          <Dropdown fluid selection multiple
                    placeholder='Оберіть локацію'
                    options={regions}
                    search={true}
                    closeOnChange={true}
                    onChange={this.onSelect.bind(this, 'regions')}
                    onOpen={this.closePopups.bind(this)}
                    minCharacters={0}/>
        </Grid.Column>}
        {!_.isUndefined(risks) && <Grid.Column>
          <Dropdown fluid selection multiple
                    placeholder='Оберіть кількість ризиків'
                    options={risks}
                    search={true}
                    closeOnChange={true}
                    onChange={this.onSelect.bind(this, 'risksSum')}
                    onOpen={this.closePopups.bind(this)}
                    minCharacters={0}/>
        </Grid.Column>}
        <Grid.Column>
          <Popup
            trigger={<Button fluid className='white-button' icon='calendar'
                             onClick={this.handleDatePopupByButton.bind(this)}
                             content={_.isNull(this.state.date) ? 'Оберіть дату' : this.state.date}/>}
            content={<MonthPicker
              months={monthNames}
              onChange={(date) => {
                let month = date.getMonth();
                let year = date.getFullYear();
                self.setState({isDateOpen: false, date: monthNames[month] + '-' + year});
                let fullMonth = (month + 1).toString().length == 1 ?
                  '0' + (parseInt(month) + 1) : (parseInt(month) + 1)
                this.props.onFiltersChange('date', year + '-' + fullMonth)
              }}/>}
            on='click'
            position='top right'
            onOpen={this.handleDateOpen.bind(this)}
            open={this.state.isDateOpen}
          />
        </Grid.Column>
        <Grid.Column>
          <Popup
            trigger={<Button fluid className='white-button'
                             textAlign='left'
                             onClick={this.handleMinMaxPopup.bind(this)}
                             content='Оберіть діапазон очікуваної вартості'/>}
            content={<div>
              <div>Від&nbsp;<Input placeholder={this.state.minAmount}
                                   onChange={this.onInputChange.bind(this, 'minAmount')}/></div>
              <div>До&nbsp;&nbsp;<Input placeholder={this.state.maxAmount}
                                        onChange={this.onInputChange.bind(this, 'maxAmount')}/></div>
              <br/>
              <Button fluid basic onClick={this.handleMinMaxAmount.bind(this)}>Підтвердити</Button>
            </div>}
            on='click'
            position='top right'
            open={this.state.isMinMaxOpen}
          />

        </Grid.Column>
        <Grid.Column>
          <Dropdown fluid selection multiple
                    placeholder='Оберіть CPV'
                    options={cpv}
                    search={true}
                    closeOnChange={true}
                    onChange={this.onSelect.bind(this, 'cpv')}
                    onOpen={this.closePopups.bind(this)}
                    minCharacters={0}/>
        </Grid.Column>
        <Grid.Column>
          <Dropdown fluid selection multiple
                    placeholder='Оберіть тип методу закупівлі'
                    options={procurementMethodType}
                    search={true}
                    closeOnChange={true}
                    onChange={this.onSelect.bind(this, 'procurentMethodTypes')}
                    onOpen={this.closePopups.bind(this)}
                    minCharacters={0}/>
        </Grid.Column>
      </Grid.Row>

    )
  }
}

Filter.propTypes = {
  filter: PropTypes.object.isRequired,
  regions: PropTypes.array,
  risks: PropTypes.array,
  buyers: PropTypes.array.isRequired,
  cpv: PropTypes.array.isRequired,
  procurementMethodType: PropTypes.array.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  defaultBuyer: PropTypes.number
};
