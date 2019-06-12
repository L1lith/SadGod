const getCurrentSWF = require('./getCurrentSWF')
const downloadSWF = require('./downloadSWF')
const extractSWF = require('./extractSWF')
const parseExtractedData = require('./parseExtractedData')

async function getCurrentSWFData() {
  const swf = await getCurrentSWF()
  await downloadSWF(swf)
  await extractSWF(swf)
  return await parseExtractedData(swf)
}

module.exports = getCurrentSWFData
