import { describe, expect, test } from 'bun:test'
import { renderHome } from '../home'

describe('renderHome', () => {
  test('returns HTML with given props', () => {
    const html = renderHome({ appName: 'TestApp', appEnv: 'dev', port: 3000, svg: '<svg></svg>' })
    expect(html).toContain('TestApp')
    expect(html).toContain('dev')
    expect(html).toContain('3000')
    expect(html).toContain('<svg class="logo"')
    expect(html).toContain('/favicon.ico')
  })

  test('returns valid HTML structure', () => {
    const html = renderHome({ appName: 'X', appEnv: 'prod', port: 8080, svg: '<svg/>' })
    expect(html).toStartWith('<!doctype html>')
    expect(html).toContain('</html>')
  })
})
