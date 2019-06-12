const {writeFileSync} = require('fs')
const {join} = require('path')

let rawApplicationStore

const applicationStoragePath = join(__dirname, '../ApplicationStorage.json')

try {
  rawApplicationStore = require(applicationStoragePath)
} catch(error) {}

rawApplicationStore = typeof rawApplicationStore == 'object' && rawApplicationStore !== null ? rawApplicationStore : {}

module.exports = new Proxy(rawApplicationStore, {
  set: (obj, prop, value) => {
    obj[prop] = value
    writeFileSync(applicationStoragePath, JSON.stringify(rawApplicationStore))
    return true
  },
  deleteProperty: (obj, prop) => {
    delete obj[prop]
    writeFileSync(applicationStoragePath, JSON.stringify(rawApplicationStore))
    return true
  }
})
