# Dashboard setup

All original package names are retained; Angular CDK is also included as a PrimeNG peer dependency.
Versions are frozen in package.json and package-lock.json. Use npm ci to reproduce this graph.
Tailwind/PostCSS build tools are in devDependencies. Angular is standalone and zoneless, without SSR.
PrimeNG, Aura, Tailwind, PrimeIcons, HTTP and Iconify registration are configured.
NgRx, Chart.js and date-fns are installed and ready for feature-specific imports.
PrimeNG 22 / PrimeUI uses Community/Commercial licensing. Configure an appropriate license for your use.
Documentation: https://primeng.dev/installation and https://primeng.dev/migration/v22

Commands: npm start; npm run build; npm run test:ci; npm run audit:security.
A successful npm audit means zero known advisories in the npm database at that time, not a security guarantee.
