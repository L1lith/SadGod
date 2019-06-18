function renameProperties(object, propertyMap) {
  if (typeof object != 'object' || object === null) throw new Error("Must supply an object to rename it's properties")
  if (typeof propertyMap != 'object' || propertyMap === null) throw new Error("Property map must be an object")
  if (Object.values(propertyMap).some(value => typeof value != 'string')) throw new Error("All property map values must be strings")
  const output = {...object}
  Object.entries(propertyMap).forEach(([oldPropertyName, newPropertyName]) => {
    if (!output.hasOwnProperty(oldPropertyName)) return
    delete output[oldPropertyName]
    output[newPropertyName] = object[oldPropertyName]
  })
  return output
}

module.exports = renameProperties
