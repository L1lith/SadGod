const fetch = require('node-fetch')
const cheerio = require('cheerio')
const {writeFileSync} = require('fs')
const {join, basename} = require('path')

const indexURL = "https://www.realmofthemadgod.com/"
const gameVersionRegex = /(?<=^AGCLoader)[0-9]+$/gi

async function getCurrentSWF() {
  const indexPage = await (await fetch(indexURL)).text()
  writeFileSync(join(__dirname, 'index.html'), indexPage)
  const indexDOM = cheerio.load(indexPage, { xmlMode: true, decodeEntities: false })
  let name = indexDOM('embed').filter((index, embed) => (embed.attribs.src || "").toLowerCase().startsWith("agcloader")).attr("src")
  name = name.substring(0, name.lastIndexOf('.'))
  if (!name) throw new Error("Unable to find the game's swf entry point")
  const url = indexURL + name + '.swf'
  const version = parseInt(name.match(gameVersionRegex)[0])
  return {url, name, version}
}

module.exports = getCurrentSWF
