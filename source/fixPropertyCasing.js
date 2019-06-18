const hasLetters = /[a-z]/i

function fixPropertyCasing(parameter) {
  while (parameter.endsWith('_')) parameter = parameter.substring(0, parameter.length - 1)
  if (hasLetters.test(parameter) && parameter === parameter.toUpperCase() && !parameter.includes('_')) return parameter.toLowerCase()
  if (!parameter.includes('_')) return parameter
  return parameter.split('_').map((section, index) => {
    if (index < 1) return section.toLowerCase()
    return section.substring(0, 1).toUpperCase() + section.substring(1).toLowerCase()
  }).join('')
}

module.exports = fixPropertyCasing
