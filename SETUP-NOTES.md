# Dashboard setup

Angular Material and Angular CDK provide UI components and interaction infrastructure.
Versions are frozen in package.json and package-lock.json. Use npm ci to reproduce this graph.
Tailwind/PostCSS build tools are in devDependencies. Angular is standalone and zoneless, without SSR.
An orange/neutral Material theme, Tailwind, HTTP and Iconify registration are configured.
src/styles/theme.scss defines Material light/dark colors through its public theming APIs.
src/styles/tokens.css exposes application tokens; src/styles.css maps them to Tailwind utilities.
ThemeService defaults to the device preference and stores an explicit choice in localStorage.
public/theme-init.js applies the preference before paint; keep its storage key in sync with
THEME_STORAGE_KEY in ThemeService. The root html element owns data-theme and app-dark, so
menus, selects and dialogs inherit the same theme as the page.
Shared standalone UI components are in src/app/shared/ui; the common application shell is in
src/app/shared/layout. See DESIGN-SYSTEM.md for usage and extension guidance.
app.html is an RTL desktop demonstration with local, in-memory example employee data.
Forms, component examples and theme menu load separately; confirmation dialogs load on demand.
Iconify remains available for icons; check the license of each icon collection used.
NgRx, Chart.js and date-fns are installed and ready for feature-specific imports.
Angular Material, CDK and Tailwind use the MIT license: no paid license or license key is required.
Preserve applicable copyright and license notices when distributing the application.
Documentation: https://material.angular.dev/ and https://tailwindcss.com/docs

Commands: npm start; npm run build; npm run test:ci; npm run audit:security.
A successful npm audit means zero known advisories in the npm database at that time, not a security guarantee.
