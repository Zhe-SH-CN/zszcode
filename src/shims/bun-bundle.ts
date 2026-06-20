// bun:bundle shim — all feature flags default to false for external build
export function feature(_name: string): boolean {
  return false
}

// MACRO shim — build-time constants
export const MACRO = {
  VERSION: '0.1.0',
  PACKAGE_URL: 'https://github.com/Zhe-SH-CN/zszcode',
  NATIVE_PACKAGE_URL: '',
  FEEDBACK_CHANNEL: 'github',
  BUILD_TIME: new Date().toISOString(),
  VERSION_CHANGELOG: '',
  ISSUES_EXPLAINER: 'Report issues at https://github.com/Zhe-SH-CN/zszcode/issues',
}
