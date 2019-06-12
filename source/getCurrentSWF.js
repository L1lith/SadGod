const cheerio = require('cheerio')
const SWFData = require('./SWFData')
const fetch = require('node-fetch')
const {join} = require('path')

const indexURL = "https://www.realmofthemadgod.com/"
const gameVersionRegex = /(?<=^AGCLoader)[0-9]+$/gi
const downloadFolder = join(__dirname, '..', 'downloads')
const extractionFolder = join(__dirname, '..', 'extracted')
const cacheFolder = join(__dirname, '..', 'cache')

async function getCurrentSWF() {
  const indexPage = await (await fetch(indexURL)).text()
  const indexDOM = cheerio.load(indexPage, { xmlMode: true, decodeEntities: false })
  let loaderName = indexDOM('embed').filter((index, embed) => (embed.attribs.src || "").toLowerCase().startsWith("agcloader")).attr("src")
  if (!loaderName) throw new Error("Unable to find the game's swf entry point")
  loaderName = loaderName.substring(0, loaderName.lastIndexOf('.'))
  const version = parseInt(loaderName.match(gameVersionRegex)[0])
  const clientName = 'AssembleeGameClient' + version
  const downloadPath = join(downloadFolder, clientName + '.swf')
  const swfExtractionFolder = join(extractionFolder, clientName)
  const url = indexURL + clientName + '.swf'
  const cachePath = join(cacheFolder, version + '.json')
  return new SWFData({url, clientName, loaderName, version, downloadPath, extractionFolder: swfExtractionFolder, cachePath})
}

module.exports = getCurrentSWF
