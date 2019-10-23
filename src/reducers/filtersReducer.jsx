const initialState = {
    regions: null,
    buyers: null,
    cpv: null,
    procurementMethodType: null,
    indicators:null,
    risksSum: null
};

export default function tenders(state = initialState, action) {
    switch (action.type) {
        case 'SET_REGIONS':
            return {...state, regions: action.payload};
        case 'SET_BUYERS':
            return {...state, buyers: action.payload};
        case 'SET_CPV':
            return {...state, cpv: action.payload};
        case 'SET_PROCUREMENT_METHOD_TYPE':
            return {...state, procurementMethodType: action.payload};
        case 'SET_INDICATORS':
            return {...state, indicators: action.payload};
        case 'SET_RISKS_SUM':
            return {...state, risksSum: action.payload};
        default:
            return state
    }
}