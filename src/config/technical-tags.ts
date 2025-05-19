
export interface TechnicalTag {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const technicalTags: TechnicalTag[] = [
  { id: 'responsive', name: 'responsive', category: 'UI/UX', description: 'Adapts well to different screen sizes' },
  { id: 'accessible', name: 'accessible', category: 'UI/UX', description: 'Meets accessibility best practices (A11Y, screen readers, navigation)' },
  { id: 'ux-ui', name: 'UX/UI', category: 'UI/UX', description: 'Oriented towards a clear, usable, visually correct experience' },
  { id: 'maintainable', name: 'maintainable', category: 'Architecture', description: 'Easy to modify, scale, and understand over time' },
  { id: 'scalable', name: 'scalable', category: 'Architecture', description: 'Supports increased users, traffic, or logic without breaking' },
  { id: 'robust', name: 'robust', category: 'Architecture', description: 'Withstands errors, unexpected inputs, and edge cases' },
  { id: 'decoupled', name: 'decoupled', category: 'Architecture', description: 'Clear separation between components/logics' },
  { id: 'reusable', name: 'reusable', category: 'Architecture', description: 'Components or functions that can be reused' },
  { id: 'production-optimized', name: 'production optimized', category: 'Performance', description: 'Has optimizations enabled: tree-shaking, lazy loading, compression' },
  { id: 'performance-optimized', name: 'performance optimized', category: 'Performance', description: 'Minimizes renders, load, bundle size, memory usage' },
  { id: 'high-performance', name: 'high performance', category: 'Performance', description: 'Smooth response time, no perceptible lags' },
  { id: 'lazy-loading', name: 'lazy loading', category: 'Performance', description: 'Deferred loading of heavy components or resources' },
  { id: 'code-splitting', name: 'code splitting', category: 'Performance', description: 'Splits code into chunks to improve initial load' },
  { id: 'pre-fetching', name: 'pre-fetching', category: 'Performance', description: 'Preloads key data or resources' },
  { id: 'secure', name: 'secure', category: 'Security', description: 'Includes protection against attacks, roles, malicious inputs' },
  { id: 'route-protection', name: 'route protection', category: 'Security', description: 'Private routes properly protected' },
  { id: 'authenticated', name: 'authenticated', category: 'Security', description: 'Accessible only with proper login/authentication' },
  { id: 'session-persistence', name: 'session persistence', category: 'Security / Data', description: 'Keeps session active, manages tokens' },
  { id: 'error-handling', name: 'error handling', category: 'Behavior', description: 'Provides appropriate feedback on failures or issues' },
  { id: 'automatic-retry', name: 'automatic retry', category: 'Network / Behavior', description: 'Retries failed requests in a controlled way' },
  { id: 'data-validation', name: 'data validation', category: 'Data', description: 'Verifies user inputs before processing' },
  { id: 'type-safe', name: 'type-safe', category: 'Code / Robustness', description: 'Uses strong typing (TypeScript, schemas, etc.)' },
  { id: 'testable', name: 'testable', category: 'Testing', description: 'Structured to allow tests (unit, integration, E2E)' },
  { id: 'with-tests-included', name: 'with tests included', category: 'Testing', description: 'Contains tests that ensure functionality' },
  { id: 'component-oriented', name: 'component-oriented', category: 'Modular Design', description: 'Structure based on reusable components' },
  { id: 'modular-structure', name: 'modular structure', category: 'Architecture', description: 'Clear division by responsibilities, routes, functions' },
  { id: 'multilanguage-support', name: 'multilanguage support', category: 'Internationalization', description: 'Ability to display content in multiple languages' },
  { id: 'internationalizable', name: 'internationalizable', category: 'Internationalization', description: 'Ready to be easily translated' },
  { id: 'documented', name: 'documented', category: 'Code / Communication', description: 'Includes comments, README, or clear instructions' },
  { id: 'with-known-dependencies', name: 'with known dependencies', category: 'AI-Friendly', description: 'Uses standard or well-known libraries to avoid confusion' },
  { id: 'no-external-dependencies', name: 'no external dependencies', category: 'AI-Friendly', description: 'Standalone solution, no additional libraries' },
  { id: 'seo-optimized', name: 'SEO optimized', category: 'SEO / Frontend', description: 'Improves ranking: metadata, HTML structure, accessibility' },
  { id: 'with-ssr-or-ssg', name: 'with SSR or SSG', category: 'Performance / SEO', description: 'Uses server-side rendering or static-site generation' },
  { id: 'with-custom-hooks', name: 'with custom hooks', category: 'React / Architecture', description: 'Uses logic encapsulated in reusable hooks' },
  { id: 'logic-separated-from-ui', name: 'logic separated from UI', category: 'Architecture', description: 'Applies the container/presentation pattern' },
  { id: 'event-driven', name: 'event-driven', category: 'Advanced Architecture', description: 'Architecture based on events (useful in microservices, sockets, etc.)' },
];
