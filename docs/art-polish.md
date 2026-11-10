# Art and presentation preservation

The static conversion leaves the established presentation layer in place. The existing stylesheet, pixel assets, canvas ocean, seascape animation, synthesized sound, and result effects remain browser-side modules and are served as static files.

The UI is not being redesigned. Build changes are limited to prerendering the existing page shell, generating existing assets, and replacing server-dependent game state with local browser state. Validate presentation and responsive behavior with `npm run test:art`, `npm run test:audio`, and `npm run test:mobile` when Chrome is available.
