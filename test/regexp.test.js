'use strict'
const {expect} = require('chai')
const {resolve} = require('path')
const regexp = require('../src/regexp')

const {translate} = regexp

it('translate', () => {
  expect(translate('ab.a')).to.eql('ab\\.a$')
  expect(translate('-ab.a')).to.eql('ab\\.a$')
  expect(translate('+ab.a')).to.eql('ab\\.a$')
  expect(translate('ab.a*')).to.eql('ab\\.a')
  expect(translate('./a-').replaceAll('\\/', '/')).to.eql('^' + process.cwd() + '/a-')
  expect(translate('.some')).to.eql('\\.some$')
  expect(translate('a/**/b?c*.ts')).to.eql('a\\/(.+\\/)*b[\\w-$]c[\\w-$]*\\.ts$')
})

it('make', ()=>{
  expect(regexp('a.b').test('/xx/a.b')).true
  expect(regexp('a.b').test('/xx/a.bc')).false
  expect(regexp('$').test('n$n')).true
  expect(regexp('$').test('nn')).false
  expect(regexp('a-b').test('abb')).false
  expect(regexp('a-b').test('aba-ba')).true
})
