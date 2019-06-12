const {join} = require('path')
const {exists} = require('fs-extra')
const {promisify} = require('util')
const SWFData = require('./SWFData')
const exec = promisify(require('child_process').exec)
const mkdirp = require('mkdirp')

const ffdecLibPath = join(__dirname, '..', 'ffdec_lib.jar')
const extractionFolder = join(__dirname, '..', 'extracted')

async function extractSWF(swfData) {
  if (!(swfData instanceof SWFData)) throw new Error("Expected SWF Data")
  if (!(await exists(swfData.downloadPath))) throw new Error("This swf has not been downloaded.")
  if (!(await exists(ffdecLibPath))) throw new Error("Could not find the ffdec_lib.jar in the project root")
  await mkdirp(swfData.extractionFolder)
  const command = `java -jar ffdec_lib.jar -export script ${extractionFolder}`
  console.log(command)
  const { stdout, stderr } = await exec(command, {
    cwd: join(__dirname, '..')
  })
  console.log('aasdfas2342432  4324 234 324 ', stdout, stderr)
}

module.exports = extractSWF
