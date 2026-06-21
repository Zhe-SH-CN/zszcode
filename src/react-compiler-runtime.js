// Polyfill for React 19's compiler-runtime
// This provides the _c function used by React Compiler

export function c(size) {
  return new Array(size).fill(undefined)
}

export default { c }
