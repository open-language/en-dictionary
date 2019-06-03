const reader = require('./reader')
const dictionary = require('./dictionary')

const enDictionary = {
    init: () => {
        return new Promise((resolve, reject) => {
            reader.init()

            let retryCount = 0
            const retryCountMax = 20
            const retrier = () => {
                retryCount += 1
                if (retryCount > retryCountMax) {
                    reject(new Error('Timeout crossed 4s'))
                }
                setTimeout(() => {
                    if(reader.isReady) {
                        resolve(dictionary)
                    } else {
                        retrier()
                    }
                }, 200)
            }
            retrier()
        })
    },

}

module.exports = enDictionary