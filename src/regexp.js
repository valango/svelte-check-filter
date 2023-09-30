'use strict'
const {resolve, sep} = require('path')

const translate = (string) => {
  let path = string + ''

  if (path[0] === '-' || path[0] === '+') path = path.slice(1)

  path = /^\.?\.\//.test(path) ? resolve(process.cwd(), path) : path
  path = path.replaceAll('$', '\\$')
  path = path.replaceAll('/', '\\/')
  path = path.replace(/\.(?!(\w+$))/g, '\\.')
  path = path.replace(/\.(\w+)$/, `\\.$1$`)
  path = path.replaceAll('?', '[\\w-$]')
  path = path.replace(/\*+$/g, '')
  path = path.replaceAll('/**\\/', '/(.+\\/)!')
  path = path.replaceAll('*', '[\\w-$]*')
  path = path.replaceAll(')!', ')*')

  if (path.startsWith('\\/')) path = '^' + path

  return path
}

/**
 * Generates a RegExpr
 * @param {string} string
 * @returns {RegExp|string}
 */
const factory = (string) => {
  const path = translate(string)

  try {
    return new RegExp(path)
  } catch (error) {
    return error.message
  }
}

factory.translate = translate

module.exports = factory
