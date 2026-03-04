import '@testing-library/jest-dom'

// Silence known React act() warnings from async tests
const originalError = console.error.bind(console.error)
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : ''
    if (
      msg.includes('Warning: An update to') ||
      msg.includes('Warning: act(') ||
      msg.includes('not wrapped in act')
    ) {
      return
    }
    originalError(...args)
  }
})

afterAll(() => {
  console.error = originalError
})
