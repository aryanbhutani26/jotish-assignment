import '@testing-library/jest-dom'

// jsdom does not implement ResizeObserver — provide a minimal stub
global.ResizeObserver = class ResizeObserver {
  private callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom does not implement HTMLMediaElement.play — stub it
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: () => Promise.resolve(),
});
