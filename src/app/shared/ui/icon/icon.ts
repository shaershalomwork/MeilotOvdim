import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const PATHS = {
  grid: ['M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z'],
  users: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87',
    'M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  ],
  user: ['M20 21v-2a7 7 0 0 0-14 0v2', 'M17 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0'],
  file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6 M8 13h8 M8 17h5'],
  layers: ['m12 3 10 5-10 5L2 8z M2 12l10 5 10-5 M2 16l10 5 10-5'],
  clock: ['M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0', 'M12 6v6l4 2'],
  check: ['M20 6 9 17l-5-5'],
  'check-circle': ['M22 11.1V12a10 10 0 1 1-5.9-9.1', 'M22 4 12 14l-3-3'],
  plus: ['M12 5v14 M5 12h14'],
  search: ['M21 21l-4.35-4.35', 'M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0'],
  sun: [
    'M12 2v2 M12 20v2 M2 12h2 M20 12h2 M4.93 4.93l1.42 1.42 M17.65 17.65l1.42 1.42 M4.93 19.07l1.42-1.42 M17.65 6.35l1.42-1.42',
    'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  ],
  moon: ['M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8'],
  monitor: ['M3 3h18v14H3z M8 21h8 M12 17v4'],
  'chevron-down': ['m6 9 6 6 6-6'],
  'arrow-left': ['M19 12H5 m7-7-7 7 7 7'],
  download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3'],
  trash: [
    'M3 6h18 M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2 M5 6l1 14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-14 M10 10v7 M14 10v7',
  ],
  close: ['M18 6 6 18 M6 6l12 12'],
  info: ['M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 11v6 M12 7h.01'],
  inbox: ['M4 4h16l2 11v5H2v-5z M2 15h6l2 3h4l2-3h6'],
  filter: ['M4 7h16 M7 12h10 M10 17h4'],
} as const;

export type IconName = keyof typeof PATHS;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.65"
      stroke-linecap="round"
      stroke-linejoin="round"
      focusable="false"
    >
      @for (path of paths(); track $index) {
        <path [attr.d]="path" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 20px;
      height: 20px;
      flex: 0 0 auto;
      vertical-align: middle;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class AppIcon {
  readonly name = input.required<IconName>();
  protected readonly paths = computed(() => PATHS[this.name()]);
}
