import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon, IconName } from '../icon/icon';

@Component({
  selector: 'app-empty-state',
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="empty-icon"><app-icon [name]="icon()" /></span>
    <h3>{{ title() }}</h3>
    <p>{{ description() }}</p>
    <div class="empty-action"><ng-content /></div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--app-space-6);
      text-align: center;
    }
    .empty-icon {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      background: var(--app-neutral-soft);
      color: var(--app-text-muted);
      border-radius: var(--app-radius-card);
      margin-bottom: var(--app-space-3);
    }
    h3 {
      margin: 0;
      font-size: var(--app-text-md);
      font-weight: 600;
    }
    p {
      margin: var(--app-space-1) 0 0;
      font-size: var(--app-text-sm);
      color: var(--app-text-muted);
    }
    .empty-action:has(*) {
      margin-top: var(--app-space-4);
    }
  `,
})
export class AppEmptyState {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly icon = input<IconName>('inbox');
}
