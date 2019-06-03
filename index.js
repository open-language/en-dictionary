const reader = require('./reader')
const dictionary = require('./dictionary')

reader.init()

function start() {
    console.log( dictionary.withEachCharIn('herzegovina') )
}

const retrier = () => {
    setTimeout(() => {
        if(reader.isReady) {
            start()
        } else {
            retrier()
        }
    }, 100)
}
retrier()

