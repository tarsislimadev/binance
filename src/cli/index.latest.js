const { Database, DatabaseObject } = require('@brtmvdl/database')
const db = new Database({ config: '/data', type: 'fs' })
const readline = require('readline')
const pairs = require('./pairs.js')

class Buy {
  constructor(buy = new DatabaseObject) {
    this.pair = buy.read('pair')
    this.amount = buy.read('amount')
    this.datetime = (new Date(buy.read('datetime'))).toLocaleString()
  }

  toString() {
    const { pair, amount, datetime } = this
    return `pair: ${pair}; amount: ${amount}; datetime: ${datetime}`
  }
}

class Binance {
  state = {
    pair: '',
    buy: '',
  }

  db = {
    buys: db.in('buys'),
  }

  getPair(pair = '') {
    return pairs[this.state.pair] || ''
  }

  async question(lines = [], options = [], incr = 0) {
    console.clear()
    console.log([...lines, ...options.map((opt, ix) => `${ix + incr}) ${opt}`)].join('\r\n'))
    return await new Promise((res) => readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false }).on('line', res))
  }

  async pairsMenu() {
    const opt = await this.question(['---- Pairs Menu ----'], ['Exit', ...pairs])
    this.state.pair = +opt - 1
  }

  async buyMenu() {
    const pair = this.getPair()
    const amount = await this.question([`---- Buy ${pair} ----`, 'How much: '])
    this.db.buys.new().writeMany({ pair, amount, datetime: Date.now() })
  }

  async sellMenu() {
    const buys = this.db.buys.list().map((buy) => new Buy(buy))
    const ix = await this.question(['---- Sell ----'], ['Exit', ...buys])
    console.log('sell', ix)
  }

  async mainMenu() {
    let mayExit = false

    while (!mayExit) {
      const opt = await this.question(['---- Menu ----', 'Curent pair: ' + this.getPair()], ['Exit', 'Pairs', 'Buy', 'Sell'])
      switch (opt.toString()) {
        case '0': mayExit = true; break;
        case '1': await this.pairsMenu(); break;
        case '2': await this.buyMenu(); break;
        case '3': await this.sellMenu(); break;
      }
    }

    process.exit(0)
  }
}

const binance = new Binance()

binance.mainMenu()
