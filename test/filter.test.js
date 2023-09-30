const {Writable, WritableOptions} = require('stream')
const {createReadStream} = require('fs')
const filter = require('../src/filter')
const {expect} = require('chai')

let dst, src
let output

const write = (chunk, encoding, callback) => {
  const lines = chunk.toString().split('\n')
  for (const line of lines) output.push(line)
  callback()
}

beforeEach(() => {
  output = []
  dst = new Writable({write})
  src = createReadStream('./test/test-data.txt')
})

/* it('should read', (done) => {
  let tmo

  src.on('data', (data) => {
    expect(data.toString().length).to.be.above(0)
    if (!tmo) tmo = setTimeout(done, 10)
  })
})

it('should write', () => {
  dst.write('baa')
  dst.end()
  expect(output).to.eql(['baa'])
}) */

it('should pass all (no filters)', (done) => {
  src.on('end', () => {
    expect(output[output.length - 2]).to.eql('svelte-check found 71 errors and 98 warnings in 65 files')
    expect(output.length).to.eql(1375)
    done()
  })
  filter(src, dst, [], [])
})
it('should pass all (permissive filetrs)', (done) => {
  src.on('end', () => {
    expect(output[output.length - 2]).to.eql('svelte-check found 71 errors and 98 warnings in 65 files')
    expect(output.length).to.eql(1375)
    done()
  })
  filter(src, dst, [/\.ts$/, /\.svelte$/], [])
})

it('should pass only .ts files', (done) => {
  src.on('end', () => {
    expect(output[output.length - 2]).to.eql('svelte-check found 11 errors and 0 warnings in 4 files')
    expect(output.length).to.eql(88)
    done()
  })
  filter(src, dst, [/\/[\w-]+\.ts$/], [])
})

it('should pass only .ts and Pro*.svelte files', (done) => {
  src.on('end', () => {
    expect(output[output.length - 2]).to.eql('svelte-check found 15 errors and 13 warnings in 10 files')
    expect(output.length).to.eql(273)
    done()
  })
  filter(src, dst, [/\/[\w-]+\.ts$/, /\/[\w-]+\/Pro\w+\.svelte$/], [])
})

it('should pass only .ts and Pro*.svelte files, but not from layout folder', (done) => {
  src.on('end', () => {
    expect(output[output.length - 2]).to.eql('svelte-check found 15 errors and 10 warnings in 9 files')
    expect(output.length).to.eql(228)
    done()
  })
  filter(src, dst, [/\/[\w-]+\.ts$/, /\/[\w-]+\/Pro\w+\.svelte$/], [/\/layout\//])
})
