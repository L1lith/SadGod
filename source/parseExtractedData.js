const {join} = require('path')
const {readFile, writeFile} = require('fs-extra')

const standardPaths = {
  gameServerConnection: "scripts\\kabam\\rotmg\\messaging\\impl\\GameServerConnection.as"
}

const gameServerConnectionPacketSectionRegex = /(?<=public class GameServerConnection[\s]*\n[\s]*{)[\S\s]*(?=public static var instance\:GameServerConnection)/i
const packetIDRegex = /(?<=public static const )[A-Z]+\:int \= [0-9]+/gi

const packetIDProxy = {
  get: (target, prop) => {
    try {
      const id = parseInt(prop)
      const match = (Object.entries(target).filter(([name, packetID]) => packetID === id)[0] || [])[0]
      if (match) return match
    } catch(error) {}
    if (target.hasOwnProperty(prop)) return target[prop]
    const guessedKey = Object.keys(target).find(key => key.toLowerCase() === prop.toLowerCase())
    if (guessedKey) {
      return target[guessedKey]
    } else {
      return target[prop]
    }
  }
}

async function parseExtractedData(swfData) {
  try {
    const output = JSON.parse(await readFile(swfData.cachePath, 'utf8'))
    output.cached = true
    output.packetIDs = new Proxy(output.packetIDs, packetIDProxy)
    return output
  } catch(error) {}
  const {gameServerConnection} = await getFiles(swfData)
  const packetIDs = getPacketIDs(gameServerConnection)
  const output = {packetIDs}
  await writeFile(swfData.cachePath, JSON.stringify(output))
  output.packetIDs = new Proxy(output.packetIDs, packetIDProxy)
  output.cached = false
  return output
}

function getPacketIDs(gameServerConnection) {
  let packetIDSection = gameServerConnection.match(gameServerConnectionPacketSectionRegex)[0]
  const packetIDs = {}
  packetIDSection.match(packetIDRegex).map(packetIDString => {
    return [packetIDString.substring(0, packetIDString.indexOf(':')).trim(), parseInt(packetIDString.substring(packetIDString.lastIndexOf('=') + 1).trim())]
  }).sort(([packetName1, packetID1], [packetName2, packetID2]) => packetID1 - packetID2).forEach(([packetName, packetID]) => {
    packetIDs[packetName] = packetID
  })
  return packetIDs
}

async function getFiles(swfData) {
  const files = {...standardPaths}
  const fileEntries = Object.entries(files)
  for (let i = 0; i < fileEntries.length; i++) {
    const [name, relativePath] = fileEntries[i]
    files[name] = await readFile(join(swfData.extractionFolder, relativePath), 'utf8')
  }
  return files
}

module.exports = parseExtractedData
