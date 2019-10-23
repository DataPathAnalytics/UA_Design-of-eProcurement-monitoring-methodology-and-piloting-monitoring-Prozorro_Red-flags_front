const initialState = {
    heatMapData: null,
    heatMapDataIsLoading: false,
};

export default function tenders(state = initialState, action) {
    switch (action.type) {
        case 'SET_HEAT_MAP_DATA':
            return {...state, heatMapData: action.payload};
        case 'SET_HEAT_MAP_DATA_LOADING':
            return {...state, heatMapDataIsLoading: action.payload};
        default:
            return state
    }
}