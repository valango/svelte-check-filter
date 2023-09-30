#!/usr/bin/env node

const {name, version} = require('./package.json')
const regexp = require('./src/regexp')
const filter = require('./src/filter')

const {exit, stdin, stdout, stderr} = process

let args = process.argv.slice(2)

if (args.some(s => s === '--help' || s === '-h')) {
  process.stdout.write(`A filter for svelte-check.

  Usage:

  npx svelte-check | ${name} [options] [masks]

  Options:

  -h, --help      displays this text and exits
  -v, --version   displays current version and exits

  Masks: wildcards for matching file paths. To exclude any, precede it with minus '-'. NB: these are _not_ glob patterns!
  Example:
  npx svelte-check | ${name} "*.ts" -/layout/ -/api/\n\n`)
  process.exit()
}

if (args.some(s => s === '--version' || s === '-v')) {
  stdout.write(version + '\n')
  exit()
}

const inclusions = [], exclusions = []

for (const arg of args) {
  const rx = regexp(arg)

  if (typeof rx === 'string') {
    stderr.write(rx + '\n Mask definition: "' + arg + '"\n')
    exit(1)
  }
  (arg[0] === '-' ? exclusions : inclusions).push(rx)

  filter(stdin, stdout, inclusions, exclusions)
}
