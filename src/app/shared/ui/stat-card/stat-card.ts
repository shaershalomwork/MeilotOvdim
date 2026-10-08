import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppCard } from '../card/card';
import { AppIcon, IconName } from '../icon/icon';

@Component({
  selector: 'app-stat-card',
  imports: [AppCard, AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-card size="compact">
      <div class="stat-top">
        <span>{{ label() }}</span>
        <span class="stat-icon" [class.accent]="accent()"><app-icon [name]="icon()" /></span>
      </div>
      <div class="stat-value">{{ value() }}</div>
      <p>{{ hint() }}</p>
    </app-card>
  `,
  styleUrl: './stat-card.css',
})
export class AppStatCard {
  readonly label = input.required<string>();
  readonly value = input.required<number | string>();
  readonly icon = input.required<IconName>();
  readonly hint = input('');
  readonly accent = input(false);
}
