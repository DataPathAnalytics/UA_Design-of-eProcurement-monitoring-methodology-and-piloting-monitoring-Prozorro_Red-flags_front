export function setBuyerTendersByProcurementMethodType(data) {
    return {
        type: 'SET_BUYER_TENDERS_BY_PROCUREMENT_METHOD_TYPE',
        payload: data
    }
}

export function setBuyerTendersByCPV(data) {
    return {
        type: 'SET_BUYER_TENDERS_BY_CPV',
        payload: data
    }
}

export function setBuyerIndicators(data) {
    return {
        type: 'SET_BUYER_INDICATORS',
        payload: data
    }
}

export function setBuyerInfo(data) {
    return {
        type: 'SET_BUYER_INFO',
        payload: data
    }
}



