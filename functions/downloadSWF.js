const {join} = require('path')
const SWFData = require('./SWFData')
const download = require('download')
const {exists} = require('fs-extra')


const downloadFolder = join(__dirname, '..', 'downloads')

async function downloadSWF(swfData) {
  if (!(swfData instanceof SWFData)) throw new Error("Expected SWF Data")
  const filePath = join(downloadFolder, swfData.name + '.swf')
  if ((await exists(filePath)) !== true) {
    await download(swfData.url, downloadFolder)
  }
  return filePath
}

module.exports = downloadSWF
