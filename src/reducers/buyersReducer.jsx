const initialState = {
    buyerTendersByProcurementMethodType: null,
    buyerTendersByCPV: null,
    buyerIndicators: null,
    buyerInfo: {}
};

export default function buyer(state = initialState, action) {
    switch (action.type) {
        case 'SET_BUYER_TENDERS_BY_PROCUREMENT_METHOD_TYPE':
            return {...state, buyerTendersByProcurementMethodType: action.payload};
        case 'SET_BUYER_TENDERS_BY_CPV':
            return {...state, buyerTendersByCPV: action.payload};
        case 'SET_BUYER_INDICATORS':
            return {...state, buyerIndicators: action.payload};
        case 'SET_BUYER_INFO':
            return {...state, buyerInfo: action.payload};
        default:
            return state
    }
}