import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as filtersActions from 'actions/FiltersActions'
import Base from 'containers/Base'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
class App extends Component {
    state = {activeItem: 'main'}


    render() {
        return (
            <div className='app'>
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/' render={(props) => <Base {...props}/>}/>
                        <Route exact path='/tenders' render={(props) => <Base {...props}/>}/>
                        <Route exact path='/buyer/:id' render={(props) => <Base {...props}/>}/>
                        <Route exact path='/heatmap' render={(props) => <Base {...props}/>}/>
                    </Switch>
                </BrowserRouter>
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


export default connect(mapStateToProps, mapDispatchToProps)(App);

