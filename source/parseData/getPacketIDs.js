const renameProperties = require('../renameProperties')
const gameServerConnectionPacketSectionRegex = /(?<=public class GameServerConnection)[\S\s]+(?=public static var instance\:GameServerConnection)/i
const packetIDRegex = /(?<=public static const\s)[^:]+\:int\s\=\s[0-9]+/gi
const packetIDRenames = require('./packetIDRenames')
const fixPropertyCasing = require('./fixPropertyCasing')

function getPacketIDs(gameServerConnection) {
  let packetIDSection = gameServerConnection.match(gameServerConnectionPacketSectionRegex)[0]
  const packetIDs = {}
  packetIDSection.match(packetIDRegex).map(packetIDString => {
    return [fixPropertyCasing(packetIDString.substring(0, packetIDString.indexOf(':')).trim()), parseInt(packetIDString.substring(packetIDString.lastIndexOf('=') + 1).trim())]
  }).sort(([packetName1, packetID1], [packetName2, packetID2]) => packetID1 - packetID2).forEach(([packetName, packetID]) => {
    packetIDs[packetName] = packetID
  })
  return renameProperties(packetIDs, packetIDRenames)
}

module.exports = getPacketIDs
