const {join} = require('path')
const {exists} = require('fs-extra')
const {promisify} = require('util')
const SWFData = require('./SWFData')
const exec = promisify(require('child_process').exec)
const mkdirp = require('mkdirp')
const jpexs = require( 'jpexs-flash-decompiler' )
const isFolderEmpty = require('./isFolderEmpty')

//const ffdecLibPath = join(__dirname, '..', 'ffdec_lib.jar')
const extractionFolder = join(__dirname, '..', 'extracted')
const cacheFolder = join(__dirname, '..', 'cache')

async function extractSWF(swfData) {
  await mkdirp(cacheFolder)
  if (!(swfData instanceof SWFData)) throw new Error("Expected SWF Data")
  if (!(await exists(swfData.downloadPath))) throw new Error("This swf has not been downloaded.")
  await mkdirp(swfData.extractionFolder)
  if (!(await isFolderEmpty(swfData.extractionFolder))) return // console.warn("It appears the library has already been extracted")
  await new Promise((resolve, reject) => {
    console.log("Extracting the SWF scripts, this can take a long time!")
    jpexs.export( {
      file: swfData.downloadPath,
      output: swfData.extractionFolder,
      items: [ jpexs.ITEM.SCRIPT ]
    }, err => {
      if ( err ) return reject(err)
      resolve()
    } )
  })
}

module.exports = extractSWF
