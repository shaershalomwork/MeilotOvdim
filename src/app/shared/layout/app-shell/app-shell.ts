import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppIcon, IconName } from '../../ui/icon/icon';
import { AppThemePicker } from '../../ui/theme-picker/theme-picker';

export interface ShellNavigationItem {
  path: string;
  label: string;
  icon: IconName;
  exact?: boolean;
}

@Component({
  selector: 'app-shell',
  imports: [MatButtonModule, RouterLink, RouterLinkActive, AppIcon, AppThemePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShell {
  readonly navigation = input<ReadonlyArray<ShellNavigationItem>>([]);
  readonly appTitle = input('מרחב העבודה');
  readonly brandSubtitle = input('מזרחי טפחות');
  readonly pageTitle = input('');
}
