const initialState = {
    tendersTable: null,
    maxPage: null,
    tenderTable: null,
    tableLoading: false,
};

export default function tenders(state = initialState, action) {
    switch (action.type) {
        case 'SET_TENDERS_TABLE':
            return {...state, tendersTable: action.payload};
        case 'SET_MAX_PAGE':
            return {...state, maxPage: action.payload};
        case 'SET_TENDER_TABLE':
            return {...state, tenderTable: action.payload};
        case 'SET_TABLE_LOADING':
            return {...state, tableLoading: action.payload};
        default:
            return state
    }
}