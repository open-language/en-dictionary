const utils = {
    getArray: (query) => {
        return (!Array.isArray(query)) ? [query] : query
    }
}

module.exports = utils