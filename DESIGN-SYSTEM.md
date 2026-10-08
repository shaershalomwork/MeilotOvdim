# Application design system

The desktop interface uses neutral white/gray surfaces with restrained orange accents.
Brand orange is decorative; primary action and text colors have separate light/dark values
to keep small text readable. The palette is an application proposal, not an official brand guide.

| Source                                | Responsibility                                                                   |
| ------------------------------------- | -------------------------------------------------------------------------------- |
| `src/styles/theme.scss`               | Material palette, typography, density and public component overrides             |
| `src/styles/tokens.css`               | Semantic application colors, spacing, radii and typography                       |
| `src/styles.css`                      | Global base styles and Tailwind token mappings                                   |
| `src/app/core/theme/theme.service.ts` | Device preference, manual choice and browser persistence                         |
| `src/app/shared/layout/app-shell/`    | Shared navigation and header                                                     |
| `src/app/shared/ui/`                  | Cards, summaries, badges, page headings, search, pagination, notices and dialogs |

## Styling a new feature

Use semantic colors such as `var(--app-surface)`, `var(--app-text)` and `var(--app-border)`.
Tailwind exposes the same roles as `bg-surface`, `text-content`, `text-content-muted` and
`border-outline`. Use spacing/radius tokens for shared component conventions.

Change shared colors in the central theme rather than duplicating light/dark pairs in features.
Adjust Material through `mat.theme` and component `*-overrides` mixins. Do not depend on private
Material classes or use `::ng-deep`.

Import the standalone components a feature needs:

```html
<app-card title="פרטים" subtitle="מידע נוסף">
  <app-status-badge card-actions tone="success">פעיל</app-status-badge>
  <!-- Feature-specific content -->
</app-card>
```

`AppCard` supports `size="compact"` and `variant="soft"`. `AppStatusBadge` supports `success`,
`warning`, `danger` and `neutral`. Keep business rules in features and visual conventions in
shared components. Use Material controls directly for ordinary form fields and buttons.

For confirmations, inject `ConfirmationService` and await `confirm({ title, message,
confirmLabel, tone })`. It returns true only for an explicit confirmation; cancellation,
Escape and closing without confirmation return false. Destructive dialogs focus the cancel
button first. Dialog code loads only when requested.

## Theme behavior

The default preference is `system`. The header offers `system`, `light` and `dark`.
Device changes affect the interface only while `system` is selected. A manual choice is saved
under `meilot-ovdim.theme` and restored on reload. Other tabs receive storage changes.
If browser storage is unavailable, selection still works for the current session.

The theme is applied to `html`, including overlays attached outside the application component.
`public/theme-init.js` runs in the head before the first paint. It and ThemeService deliberately
share the storage key and root selectors. Account/device synchronization can later be added
inside ThemeService without changing feature components.

## Application shell and navigation

The root component contains only AppShell and RouterOutlet. The routes list is initially empty,
so the main content area is reserved for real application screens. No example data, forms,
tables or business actions are loaded.

AppShell has no feature-specific navigation. Supply its `navigation` input with
`ShellNavigationItem[]` from the application when routes are added. Each item defines a
`path`, `label`, `icon` and optional `exact` flag (defaults to true). RouterLinkActive tracks
the current URL and sets aria-current on the selected link. The sidebar is hidden when the
navigation list is empty.

The shell accepts `appTitle`, `brandSubtitle` and `pageTitle`. Additional header controls can
be projected with the `header-actions` attribute. There is no placeholder user profile.

Shared UI components remain available for future feature screens. Import only the components
a feature uses; the root does not render component examples.

## Validation

`npm run build` checks production compilation and existing size budgets.
`npm run test:ci` checks the empty shell, route rendering, configurable navigation,
header theme selection, theme persistence/device changes and shared confirmation behavior.
The application supports Hebrew RTL.
