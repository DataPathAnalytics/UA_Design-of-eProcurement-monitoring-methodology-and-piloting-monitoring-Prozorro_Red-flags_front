export function setTendersByProcurementMethodType(data) {
    return {
        type: 'SET_TENDERS_BY_PROCUREMENT_METHOD_TYPE',
        payload: data
    }
}

export function setTendersRisksByIndicators(data) {
    return {
        type: 'SET_TENDERS_RISKS_BY_INDICATORS',
        payload: data
    }
}

export function setBuyersTendersRisks(data) {
    return {
        type: 'SET_BUYERS_TENDERS_RISKS',
        payload: data
    }
}

export function setBuyersTendersByIndicators(data) {
    return {
        type: 'SET_BUYERS_TENDERS_BY_INDICATORS',
        payload: data
    }
}


export function setTendersByProcurementMethodTypeLoading(data) {
    return {
        type: 'SET_TENDERS_BY_PROCUREMENT_METHOD_TYPE_LOADING',
        payload: data
    }
}


export function setTendersRisksByIndicatorsLoading(data) {
    return {
        type: 'SET_TENDERS_RISKS_BY_INDICATORS_LOADING',
        payload: data
    }
}


export function setBuyersTendersRisksLoading(data) {
    return {
        type: 'SET_BUYERS_TENDERS_LOADING',
        payload: data
    }
}

export function setBuyersTendersByIndicatorsLoading(data) {
    return {
        type: 'SET_BUYERS_TENDERS_BY_INDICATORS_LOADING',
        payload: data
    }
}
