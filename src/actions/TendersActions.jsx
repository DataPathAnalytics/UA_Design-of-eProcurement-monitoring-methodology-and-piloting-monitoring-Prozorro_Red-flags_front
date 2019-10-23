

export function setTendersTable(data) {
    return {
        type: 'SET_TENDERS_TABLE',
        payload: data
    }
}

export function setTenderTable(data) {
    return {
        type: 'SET_TENDER_TABLE',
        payload: data
    }
}

export function setMaxPage(data) {
    return {
        type: 'SET_MAX_PAGE',
        payload: data
    }
}
export function setTableLoading(data) {
    return {
        type: 'SET_TABLE_LOADING',
        payload: data
    }
}


