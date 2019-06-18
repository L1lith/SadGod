const getCurrentSWF = require('./getCurrentSWF')
const downloadSWF = require('./downloadSWF')
const extractSWF = require('./extractSWF')
const parseData = require('./parseData')

async function getCurrentSWFData() {
  const swf = await getCurrentSWF()
  await downloadSWF(swf)
  await extractSWF(swf)
  return await parseData(swf)
}

module.exports = getCurrentSWFData
