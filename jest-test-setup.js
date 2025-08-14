const noop = () => {};
// Only define window properties if window exists (jsdom environment)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
}
