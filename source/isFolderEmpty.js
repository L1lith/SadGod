const {readdir} = require('fs-extra')

async function isFolderEmpty(directory) {
  const files = await readdir(directory)
  return files.length < 1
}

module.exports = isFolderEmpty
