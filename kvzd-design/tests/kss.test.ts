import { describe, expect, it } from 'vitest'
import { kss } from '../src/kss'

describe('kss', () => {
  it('maps margin tokens to pixel values', () => {
    expect(kss('mb0')).toEqual({ marginBottom: 0 })
    expect(kss('m15')).toEqual({ margin: 15 })
    expect(kss('mt20', 'ml8')).toEqual({ marginTop: 20, marginLeft: 8 })
  })

  it('maps paired sides', () => {
    expect(kss('mx12')).toEqual({ marginLeft: 12, marginRight: 12 })
    expect(kss('my16')).toEqual({ marginTop: 16, marginBottom: 16 })
    expect(kss('px20')).toEqual({ paddingLeft: 20, paddingRight: 20 })
    expect(kss('py16')).toEqual({ paddingTop: 16, paddingBottom: 16 })
  })

  it('maps padding tokens', () => {
    expect(kss('p24')).toEqual({ padding: 24 })
    expect(kss('pt12', 'pb0')).toEqual({ paddingTop: 12, paddingBottom: 0 })
    expect(kss('pl8', 'pr8')).toEqual({ paddingLeft: 8, paddingRight: 8 })
  })

  it('allows negative margins', () => {
    expect(kss('mt-20')).toEqual({ marginTop: -20 })
    expect(kss('mx-4')).toEqual({ marginLeft: -4, marginRight: -4 })
  })

  it('supports decimal values', () => {
    expect(kss('fs14.5')).toEqual({ fontSize: 14.5 })
  })

  it('maps size tokens', () => {
    expect(kss('fs19')).toEqual({ fontSize: 19 })
    expect(kss('w370')).toEqual({ width: 370 })
    expect(kss('h40')).toEqual({ height: 40 })
  })

  it('skips falsy inputs', () => {
    expect(kss('mb0', false, null, undefined, '')).toEqual({ marginBottom: 0 })
    expect(kss(false)).toEqual({})
  })

  it('lets later tokens win for the same property', () => {
    expect(kss('mb0', 'mb10')).toEqual({ marginBottom: 10 })
  })

  it('returns a cached object for identical token lists', () => {
    expect(kss('mb0', 'fs19')).toBe(kss('mb0', 'fs19'))
  })

  it('throws on unknown tokens', () => {
    expect(() => kss('nope' as never)).toThrow('[kss] unknown token: "nope"')
    expect(() => kss('mb' as never)).toThrow('[kss] unknown token: "mb"')
    expect(() => kss('w-40' as never)).toThrow('[kss] unknown token: "w-40"')
  })
})
