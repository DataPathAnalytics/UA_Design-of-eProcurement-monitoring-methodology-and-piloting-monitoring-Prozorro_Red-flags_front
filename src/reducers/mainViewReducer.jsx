const initialState = {
    tendersByProcurementMethodType: null,
    tendersRisksByIndicators: null,
    buyersTendersRisks: null,
    buyersTendersByIndicators: null,
    tendersByProcurementMethodTypeIsLoading: false,
    tendersRisksByIndicatorsIsLoading: false,
    buyersTendersRisksIsLoading: false,
    buyersTendersByIndicatorsIsLoading: false,
};

export default function main(state = initialState, action) {
    switch (action.type) {
        case 'SET_TENDERS_BY_PROCUREMENT_METHOD_TYPE':
            return {...state, tendersByProcurementMethodType: action.payload};
        case 'SET_TENDERS_RISKS_BY_INDICATORS':
            return {...state, tendersRisksByIndicators: action.payload};
        case 'SET_BUYERS_TENDERS_RISKS':
            return {...state, buyersTendersRisks: action.payload};
        case 'SET_BUYERS_TENDERS_BY_INDICATORS':
            return {...state, buyersTendersByIndicators: action.payload};
        case 'SET_TENDERS_BY_PROCUREMENT_METHOD_TYPE_LOADING':
            return {...state, tendersByProcurementMethodTypeIsLoading: action.payload};
        case 'SET_TENDERS_RISKS_BY_INDICATORS_LOADING':
            return {...state, tendersRisksByIndicatorsIsLoading: action.payload};
        case 'SET_BUYERS_TENDERS_LOADING':
            return {...state, buyersTendersRisksIsLoading: action.payload};
        case 'SET_BUYERS_TENDERS_BY_INDICATORS_LOADING':
            return {...state, buyersTendersByIndicatorsIsLoading: action.payload};
        default:
            return state
    }
}