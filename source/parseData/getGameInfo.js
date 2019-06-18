const evaljs = require('evaljs')
const fixPropertyCasing = require('./fixPropertyCasing')
const renameProperties = require('../renameProperties')
const gameInfoRenames = require('./gameInfoRenames')

const parameterSectionRegex = /(?<=public class Parameters)[\S\s]+(?=public function Parameters\(\))/i
const parameterVariableRegex = /(?<=static (var|const) )[a-z\_]+(?:\:[a-z\_\.\<\>]+ = )[^\;\n]+(?=\;)/gi

function getGameInfo(parameterSection) {
  parameterSection = (parameterSection.match(parameterSectionRegex) || [])[0]
  if (!parameterSection) throw new Error("Could not find the parameter section")
  let lines = parameterSection.match(parameterVariableRegex)
  const output = {}
  lines.forEach(line => {
    const property = fixPropertyCasing(line.split(':')[0])//.replace(/_/g, '').toUpperCase()
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

module.exports = getGameInfo
