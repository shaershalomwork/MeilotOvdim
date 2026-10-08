import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.html',
  styleUrl: './card.css',
  host: {
    '[class.compact]': 'size() === "compact"',
    '[class.soft]': 'variant() === "soft"',
  },
})
export class AppCard {
  readonly title = input('');
  readonly subtitle = input('');
  readonly size = input<'default' | 'compact'>('default');
  readonly variant = input<'default' | 'soft'>('default');
}
