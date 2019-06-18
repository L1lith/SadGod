module.exports = {
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
