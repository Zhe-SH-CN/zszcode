// Shim for react/compiler-runtime — used by React Compiler output.
// In non-compiled React 18, this is a no-op cache function.
export function c(size: number) {
  // React Compiler uses this to create a fixed-size cache per hook call.
  // For external builds without the compiler, we return a simple array-based cache.
  return new Array(size).fill(undefined)
}
