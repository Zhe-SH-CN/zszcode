// Stub for external builds — the real file only exists in the internal repo.
// The call site is guarded by USER_TYPE === 'ant' which is never true externally,
// so this stub is never actually executed.
export function checkProtectedNamespace() {
  return false
}
