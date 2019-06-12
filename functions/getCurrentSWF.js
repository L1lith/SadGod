const cheerio = require('cheerio')
const SWFData = require('./SWFData')
const fetch = require('node-fetch')
const {join} = require('path')

const indexURL = "https://www.realmofthemadgod.com/"
const gameVersionRegex = /(?<=^AGCLoader)[0-9]+$/gi
const downloadFolder = join(__dirname, '..', 'downloads')
const extractionFolder = join(__dirname, '..', 'extracted')

async function getCurrentSWF() {
  const indexPage = await (await fetch(indexURL)).text()
  const indexDOM = cheerio.load(indexPage, { xmlMode: true, decodeEntities: false })
  let name = indexDOM('embed').filter((index, embed) => (embed.attribs.src || "").toLowerCase().startsWith("agcloader")).attr("src")
  name = name.substring(0, name.lastIndexOf('.'))
  const downloadPath = join(downloadFolder, name + '.swf')
  const swfExtractionFolder = join(extractionFolder, name)
  if (!name) throw new Error("Unable to find the game's swf entry point")
  const url = indexURL + name + '.swf'
  const version = parseInt(name.match(gameVersionRegex)[0])
  return new SWFData({url, name, version, downloadPath, extractionFolder: swfExtractionFolder})
}

module.exports = getCurrentSWF
