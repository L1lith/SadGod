const {readFile} = require('fs-extra')
const {join} = require('path')

const standardPaths = {
  gameServerConnection: "scripts\\kabam\\rotmg\\messaging\\impl\\GameServerConnection.as",
  parameterSection: "scripts\\com\\company\\assembleegameclient\\parameters\\Parameters.as"
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

module.exports = getFiles
