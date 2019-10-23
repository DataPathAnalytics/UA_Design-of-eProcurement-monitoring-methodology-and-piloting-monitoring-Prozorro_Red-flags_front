var axios = require('axios');

export function get(url) {
    return axios.get(url)
}

export function post(url, data) {
    return axios.post(url, data, {
        headers: {'Content-Type': 'application/json'}
    })
}

export function build_url(filter_object) {
    return _.isObject(filter_object) ? '?' + Object.keys(filter_object).map((key) => {
            if (!_.isNull(filter_object[key]) && !_.isEmpty(filter_object[key].join(''))) {
                return filter_object[key].map((value) => {
                    return key + '=' + value
                }).join('&')
            }
        }).filter((obj) => {
            return !_.isUndefined(obj)
        }).join('&') : ''
}