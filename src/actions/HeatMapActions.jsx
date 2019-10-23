export function setHeatMapData(data) {
    return {
        type: 'SET_HEAT_MAP_DATA',
        payload: data
    }
}


export function setHeatMapDataLoading(data) {
    return {
        type: 'SET_HEAT_MAP_DATA_LOADING',
        payload: data
    }
}