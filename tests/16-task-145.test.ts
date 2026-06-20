import { describe, test, expect } from 'bun:test'
import { existsSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 145: Vite + React + TypeScript + Tailwind project init', () => {
  test('web/package.json exists', () => {
    expect(existsSync(join(WEB, 'package.json'))).toBe(true)
  })

  test('web/vite.config.ts exists', () => {
    expect(existsSync(join(WEB, 'vite.config.ts'))).toBe(true)
  })

  test('web/tailwind.config.js exists', () => {
    expect(existsSync(join(WEB, 'tailwind.config.js'))).toBe(true)
  })

  test('web/src/main.tsx exists', () => {
    expect(existsSync(join(WEB, 'src', 'main.tsx'))).toBe(true)
  })

  test('web/tsconfig.json exists', () => {
    expect(existsSync(join(WEB, 'tsconfig.json'))).toBe(true)
  })
})
