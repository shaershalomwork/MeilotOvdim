import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ThemePreference, ThemeService } from '../../../core/theme/theme.service';
import { AppIcon, IconName } from '../icon/icon';

@Component({
  selector: 'app-theme-picker',
  imports: [MatButtonModule, MatMenuModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-stroked-button
      type="button"
      [matMenuTriggerFor]="themeMenu"
      class="theme-trigger"
      aria-label="בחירת מצב תצוגה"
    >
      <app-icon [name]="themeOption().icon" /><span>{{ themeOption().label }}</span
      ><app-icon name="chevron-down" />
    </button>
    <mat-menu #themeMenu="matMenu">
      @for (option of themeOptions; track option.value) {
        <button mat-menu-item type="button" (click)="theme.setPreference(option.value)">
          <span class="theme-menu-option"
            ><app-icon [name]="option.icon" /><span>{{ option.label }}</span>
            @if (theme.preference() === option.value) {
              <app-icon name="check" />
            }
          </span>
        </button>
      }
    </mat-menu>
  `,
  styles: `
    .theme-trigger app-icon {
      width: 16px;
      height: 16px;
      margin-inline-end: 7px;
    }
    .theme-trigger app-icon:last-child {
      width: 13px;
      margin-inline: 7px 0;
    }
    .theme-menu-option {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 155px;
    }
    .theme-menu-option app-icon:last-child:not(:first-child) {
      margin-inline-start: auto;
      color: var(--app-primary);
    }
  `,
})
export class AppThemePicker {
  protected readonly theme = inject(ThemeService);
  protected readonly themeOptions: ReadonlyArray<{
    value: ThemePreference;
    label: string;
    icon: IconName;
  }> = [
    { value: 'system', label: 'לפי המערכת', icon: 'monitor' },
    { value: 'light', label: 'מצב בהיר', icon: 'sun' },
    { value: 'dark', label: 'מצב כהה', icon: 'moon' },
  ];
  protected readonly themeOption = computed(() =>
    this.themeOptions.find((option) => option.value === this.theme.preference())!,
  );
}
