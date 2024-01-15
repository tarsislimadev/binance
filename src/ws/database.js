import { Database } from '@brtmvdl/database'

const db = new Database({ config: '/data', type: 'fs' })

export const savePairsPrices = (prices = [], datetime = Date.now()) => prices.map(({ symbol, price } = {}) => db.in('price').new().writeMany({ symbol, price, datetime }))

export const saveBuy = (symbol, price, amount = 1, datetime = Date.now()) => Promise.resolve(db.in('buy').new().writeMany({ symbol, price, amount, datetime }))

export const getAllBuys = () => db.in('buy').list().map((buy) => buy.readManyString(['symbol', 'price', 'amount', 'datetime'])).map(([symbol, price, amount, datetime]) => ({ symbol, price, amount, datetime }))
