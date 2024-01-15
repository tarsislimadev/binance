import { Database } from '@brtmvdl/database'

const db = new Database({ config: '/data', type: 'fs' })

export const savePairsPrices = (prices = [], datetime = Date.now()) => prices.map(({ symbol, price } = {}) => db.in('prices').new().writeMany({ symbol, price, datetime }))
