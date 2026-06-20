// Devtools connection for React DevTools
// This is a side-effect only module

try {
  const devtools = await import('react-devtools-core')
  if (devtools?.connectToDevTools) {
    devtools.connectToDevTools()
  }
} catch {
  // react-devtools-core not available
}
