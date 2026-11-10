import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch has a setter so browser extensions or interceptors never throw
// "TypeError: Cannot set property fetch of #<Window> which has only a getter"
try {
  let activeFetch = typeof window !== 'undefined' && window.fetch ? window.fetch.bind(window) : undefined;
  const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (!desc || (desc.configurable && !desc.set && desc.writable !== true)) {
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get() {
        return activeFetch;
      },
      set(fn) {
        if (typeof fn === 'function') {
          activeFetch = fn;
        }
      },
    });
  }
} catch {
  // Ignore if non-configurable
}

createRoot(document.getElementById('root')!).render(<App />);

