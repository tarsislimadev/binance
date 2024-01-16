import * as api from './api.js'
import * as constants from './constants.js'
import * as database from './database.js'

const SYMBOL = 'AVAXBRL'

const symbolDiffs = (price = {}, datetime = Date.now()) => ({
  ...price,
  datetime,
  price_x: database.getOldestPriceSync(price.symbol, datetime - constants.DATETIME_X),
  price_y: database.getOldestPriceSync(price.symbol, datetime - constants.DATETIME_Y)
})

const saveTickerPrice = () =>
  api.getTickerPrice(SYMBOL)
    .then(({ symbol, price, datetime = Date.now() }) => {
      database.savePriceSync(symbol, price, datetime)
      const s1 = symbolDiffs({ symbol, price, datetime })
      const buy = (+s1?.price_x?.price > +price && +price > +s1?.price_y?.price) ? '' : 'not'
      console.log(`may ${buy} buy`, s1)
      const sell = (+s1?.price_x?.price < +price && +price < +s1?.price_y?.price) ? '' : 'not'
      console.log(`may ${sell} buy`, s1)
    })
    .catch((err) => console.error(err))
    .finally(() => setTimeout(saveTickerPrice, 500))

saveTickerPrice()
