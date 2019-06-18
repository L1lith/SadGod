const {join} = require('path')
const {readFile, writeFile} = require('fs-extra')
const packetIDsProxy = require('./packetIDsProxy')
const getGameInfo = require('./getGameInfo')
const getFiles = require('./getFiles')
const getPacketIDs = require('./getPacketIDs')

async function parseExtractedData(swfData) {
  // try {
  //   const output = JSON.parse(await readFile(swfData.cachePath, 'utf8'))
  //   output.cached = true
  //   output.packetIDs = new Proxy(output.packetIDs, packetIDProxy)
  //   return output
  // } catch(error) {}
  const {gameServerConnection, parameterSection} = await getFiles(swfData)
  const packetIDs = getPacketIDs(gameServerConnection)
  const gameInfo = getGameInfo(parameterSection)
  const output = {packetIDs, gameInfo}
  await writeFile(swfData.cachePath, JSON.stringify(output))
  output.packetIDs = new Proxy(output.packetIDs, packetIDsProxy)
  output.cached = false
  return output
}

module.exports = parseExtractedData
