const {Readable, Writable} = require('stream')

const neutral = 0, pass = 1, ignore = 2
const startRx = /^([\/.\w-]+\.\w{2,}):\d+:\d+$/
const known = new Set()
let /** @type {RegExp[]} */ exclude = []
let /** @type {RegExp[]} */ include = []
let /** @type {string[]} */ output = []
let count = 0, errors = 0, warnings = 0
let state = neutral
let pending = ''
// let speak = false

const filter = (data) => {
  const input = (data = pending + data).split('\n')
  let r

  pending = data.endsWith('\n') ? '' : input.pop()

  count += input.length
  //  /\w\/ui\//
  for (const line of input) {
    if (line.startsWith('===')) {
      state = neutral
    } else if ((r = startRx.exec(line))) {
      /* if(line.includes('/ui/')){
        console.log('IN', (include.length === 0 || include.some(rx => rx.test(r[1]))))
        console.log('EX', !exclude.some(rx => rx.test(r[1])))
        console.log('ex', exclude)
        speak = true
      } */
      if ((include.length === 0 || include.some(rx => rx.test(r[1]))) &&
        !exclude.some(rx => rx.test(r[1]))) {
        known.add(r[1])
        state = pass
      } else state = ignore
      /* if(speak){
        console.log('ST', state)
        process.exit()
      } */
    }
    if (state !== ignore) {
      if (state === pass) {
        if (line.startsWith('Error: ')) errors += 1
        else if (line.startsWith('Warn: ')) warnings += 1
      }
      const r = /^(svelte-check\sfound\s)\d+(\D+)\d+(\D+)\d+(\D+)$/.exec(line)
      output.push(r ? r[1] + errors + r[2] + warnings + r[3] + known.size + r[4] : line)
    }
  }
}

/**
 * @param {Writable} destination
 * @param {boolean} final
 */
const flush = (destination, final) => {
  if (output.length !== 0) {
    destination.write(output.join('\n'))
    output = []
  }
  if (final) destination.end()
}

/**
 * @param {Readable} source
 * @param {Writable} destination
 */
const transform = (source, destination) => {
  source
    .on('data', (data) => {
      filter(data)
      flush(destination, false)
    })
    .on('end', () => {
      flush(destination, true)
      if (process.env.NODE_ENV !== 'test') process.exit()
    })
}

/**
 *
 * @param {Writable} destination
 * @param {Readable} source
 * @param {RegExp[]} inclusions
 * @param {RegExp[]} exclusions
 */
module.exports = (source, destination, inclusions, exclusions) => {
  count = errors = warnings = files = 0
  state = neutral
  output = []
  exclude = exclusions
  include = inclusions
  pending = ''
  known.clear()

  transform(source, destination)

  if (process.env.NODE_ENV !== 'test') {
    setImmediate(() => {
      if (count === 0) process.exit()
    })
  }
}
