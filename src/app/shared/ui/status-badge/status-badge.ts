import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';

@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-tone]': 'tone()' },
  template: '<span class="dot" aria-hidden="true"></span><ng-content />',
  styleUrl: './status-badge.css',
})
export class AppStatusBadge {
  readonly tone = input<StatusTone>('neutral');
}
