class SWFData {
  constructor(data) {
    if (typeof data == 'object' && data !== null) {
      Object.assign(this, data)
    }
  }
}

module.exports = SWFData
