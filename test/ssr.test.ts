import userflow from '../src/userflow'

test('can load userflow in Node land', () => {
  expect(typeof window).toBe('undefined')
  expect(typeof userflow.init).toBe('function')
})
