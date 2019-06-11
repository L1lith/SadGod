const {join} = require('path')
const SWFData = require('./SWFData')
const download = require('download')

const downloadFolder = join(__dirname, '..', 'downloads')

async function downloadSWF(swfData) {
  if (!(swfData instanceof SWFData)) throw new Error("Expected SWF Data")
  await download(swfData.url, downloadFolder)
  return join(downloadFolder, swfData.name + '.swf')
}

module.exports = downloadSWF
