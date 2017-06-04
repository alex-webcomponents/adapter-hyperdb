const pify = require('pify');
const hyperdb = require('hyperdb')
const hypercore = require('hypercore')
const ram = require('random-access-memory')

let db;

function init(options) {
  db = hyperdb([
    hypercore(ram, {valueEncoding: 'json'})
  ])
}

async function get(key, options) {
  const nodes = await pify(db.get.bind(db))(key)
  if (nodes.length > 1) {
    throw new Error('Cannot deal with forks yet 😱')
  }

  if (nodes.length === 0) {
    return { views: [] }
  }

  return nodes[0].value
}

function put(key, value) {
  return pify(db.put.bind(db))(key, value)
}

function getAll(options) {
}

async function has(key) {
  const nodes = await pify(db.get.bind(db))(key)
  return nodes.length === 0
}

async function keys() {
}

function close() {
  return pify(db.close.bind(db))()
}

module.exports = {
  options: [
    {
      name: 'p2p-storage',
      description: 'The name of the adapter used as storage by the p2p adapter.',
      defaultValue: process.env.P2P_STORAGE || 'memory'
    }
  ],
  init: init,
  get: get,
  put: put,
  has: has,
  keys: keys,
  getAll: getAll,
  close: close,
};
