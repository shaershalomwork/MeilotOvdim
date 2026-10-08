import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <p class="eyebrow">{{ eyebrow() }}</p>
      <h1>{{ title() }}</h1>
      @if (subtitle()) {
        <p class="subtitle">{{ subtitle() }}</p>
      }
    </div>
    <div class="actions"><ng-content /></div>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--app-space-6);
      margin-bottom: var(--app-space-6);
    }
    h1 {
      margin: 4px 0;
      font-size: 28px;
      font-weight: 650;
      letter-spacing: -0.6px;
    }
    p {
      margin: 0;
      color: var(--app-text-muted);
    }
    .eyebrow {
      font-size: var(--app-text-xs);
    }
    .subtitle {
      font-size: var(--app-text-md);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: var(--app-space-3);
    }
  `,
})
export class AppPageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly eyebrow = input('');
}
