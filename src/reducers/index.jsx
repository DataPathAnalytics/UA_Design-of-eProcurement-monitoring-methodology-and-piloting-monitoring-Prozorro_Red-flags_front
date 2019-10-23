import {combineReducers} from 'redux'
import mainViewReducer from 'reducers/mainViewReducer'
import tendersReducer from 'reducers/tendersReducer'
import filtersReducer from 'reducers/filtersReducer'
import buyersReducer from 'reducers/buyersReducer'
import heatMapReducer from 'reducers/heatMapReducer'

export default combineReducers({
    mainViewReducer,
    tendersReducer,
    filtersReducer,
    buyersReducer,
    heatMapReducer
})