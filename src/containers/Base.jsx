import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as filtersActions from 'actions/FiltersActions'
import {Link} from 'react-router-dom'
import MainView from 'containers/MainView'
import Tenders from 'containers/Tenders'
import HeatMapView from 'containers/HeatMapView'
import Buyer from 'containers/Buyer'
import {Grid} from 'semantic-ui-react'
import {Menu, Segment} from 'semantic-ui-react'
class Base extends Component {
  INSTRUCTION_LINK = 'https://docs.google.com/document/d/1_A4bvN4M7fuznJ8ZHymeX-e1S_0Y9nGfaf0F7guBzDY/edit'
  state = {activeItem: this.props.location.pathname.split('/')[1]}
  handleItemClick = (name) => this.setState({activeItem: name})


  render() {
    const {activeItem} = this.state;
    return (
      <div className='app'>
        <Grid stackable={true}>
          <Grid.Row columns='equal' stackable={true}>
            <Grid.Column >
              <Menu attached='top' tabular className={'custom'}>
                <Link to='' className={'item' + ((activeItem === '') ? ' active' : '')}
                      onClick={this.handleItemClick.bind(this, '')}>Головна</Link>
                <Link to='/tenders' className={'item' + ((activeItem === 'tenders') ? ' active' : '')}
                      onClick={this.handleItemClick.bind(this, 'tenders')}>Тендери</Link>
                <Link to='/heatmap' className={'item' + ((activeItem === 'heatmap') ? ' active' : '')}
                      onClick={this.handleItemClick.bind(this, 'heatmap')}>Карта ризиків</Link>

                {(activeItem === 'buyer') && <Menu.Item name='buyer'
                                                        active={activeItem === 'buyer'}
                                                        onClick={this.handleItemClick}>Замовник</Menu.Item>}
                <Menu.Menu position='right'>
                  <Menu.Item name='Інструкція'  onClick={()=>{window.location=this.INSTRUCTION_LINK}}/>
                </Menu.Menu>
              </Menu>

              <Segment className='content' attached='bottom'>
                {activeItem === '' && <MainView/>}
                {activeItem === 'tenders' && <Tenders/>}
                {activeItem === 'heatmap' && <HeatMapView/>}
                {activeItem.startsWith('buyer') &&
                <Buyer buyerId={this.props.match.params.id}/>}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
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
    filtersActions: bindActionCreators(filtersActions, dispatch),
  }

}


export default connect(mapStateToProps, mapDispatchToProps)(Base);

