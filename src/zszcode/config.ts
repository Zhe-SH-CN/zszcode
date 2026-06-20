import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

export interface ZszCodeConfig {
  model: string
  baseUrl: string
  apiKey: string
  webPort: number
  autoOpenBrowser: boolean
  permissionMode: 'auto' | 'confirm'
}

export const DEFAULTS: ZszCodeConfig = {
  model: 'mimo-v2.5-pro',
  baseUrl: 'https://token-plan-cn.xiaomimimo.com/anthropic',
  apiKey: 'tp-c2vyjcx7y4xxzfs6s8sz8htsw7ou3ts2afdulks4mcc0iecy',
  webPort: 3000,
  autoOpenBrowser: false,
  permissionMode: 'confirm',
}

export const CONFIG_DIR = join(homedir(), '.zszcode')
export const CONFIG_FILE = join(CONFIG_DIR, 'settings.json')

export function loadConfig(): ZszCodeConfig {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true })
  }

  if (!existsSync(CONFIG_FILE)) {
    writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULTS, null, 2), 'utf-8')
    return { ...DEFAULTS }
  }

  const raw = readFileSync(CONFIG_FILE, 'utf-8')
  const parsed = JSON.parse(raw) as Record<string, unknown>
  const knownKeys: (keyof ZszCodeConfig)[] = [
    'model', 'baseUrl', 'apiKey', 'webPort', 'autoOpenBrowser', 'permissionMode',
  ]
  const picked: Partial<ZszCodeConfig> = {}
  for (const key of knownKeys) {
    if (key in parsed) {
      ;(picked as any)[key] = parsed[key]
    }
  }
  return { ...DEFAULTS, ...picked }
}
