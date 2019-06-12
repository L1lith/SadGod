const {join} = require('path')
const SWFData = require('./SWFData')
const download = require('download')
const {exists} = require('fs-extra')

const downloadFolder = join(__dirname, '..', 'downloads')

async function downloadSWF(swfData) {
  if (!(swfData instanceof SWFData)) throw new Error("Expected SWF Data")
  if ((await exists(swfData.downloadPath)) !== true) {
    await download(swfData.url, downloadFolder)
  }
}

module.exports = downloadSWF
