const {join} = require('path')
const {readFile, writeFile} = require('fs-extra')
const evaljs = require('evaljs')

const standardPaths = {
  gameServerConnection: "scripts\\kabam\\rotmg\\messaging\\impl\\GameServerConnection.as",
  parameterSection: "scripts\\com\\company\\assembleegameclient\\parameters\\Parameters.as"
}

const parameterSectionRegex = /(?<=public class Parameters)[\S\s]+(?=public function Parameters\(\))/i
const gameServerConnectionPacketSectionRegex = /(?<=public class GameServerConnection)[\S\s]+(?=public static var instance\:GameServerConnection)/i
const packetIDRegex = /(?<=public static const\s)[^:]+\:int\s\=\s[0-9]+/gi

const packetIDProxy = {
  get: (target, prop) => {
    if (typeof prop == 'symbol') {
      let name = prop.toString()
      name = name.slice(7, name.length - 1).toLowerCase()
      let output = null
      switch(name) {
        case "nodejs.util.inspect.custom":
          output = target
          break
        case "symbol.tostringtag":
          return target.toString()
        case "symbol.iterator":
          return target
        default:
          throw new Error(`Unrecognized Symbol "${name}"`)
      }
      return output
    }
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
  const {gameServerConnection, parameterSection} = await getFiles(swfData)
  const packetIDs = getPacketIDs(gameServerConnection)
  const gameInfo = getGameInfo(parameterSection)
  const output = {packetIDs, gameInfo}
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

const parameterVariableRegex = /(?<=static (var|const) )[a-z\_]+(?:\:[a-z\_\.\<\>]+ = )[^\;\n]+(?=\;)/gi

function getGameInfo(parameterSection) {
  parameterSection = (parameterSection.match(parameterSectionRegex) || [])[0]
  if (!parameterSection) throw new Error("Could not find the parameter section")
  let lines = parameterSection.match(parameterVariableRegex)
  const output = {}
  lines = lines.forEach(line => {
    let property = line.split(':')[0]//.replace(/_/g, '').toUpperCase()
    if (property.endsWith('_')) property = property.slice(0, property.length - 1)
    const valueString = line.split('=').slice(1).join('=')
    try {
      const value = evaljs.evaluate(valueString)
      output[property] = value
    } catch(error) {
      output[property] = valueString
    }
  })
  delete output.keyNames
  return output
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
