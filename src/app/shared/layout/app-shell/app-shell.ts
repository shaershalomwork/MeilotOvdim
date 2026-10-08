import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AppIcon, IconName } from '../../ui/icon/icon';
import { AppThemePicker } from '../../ui/theme-picker/theme-picker';

@Component({
  selector: 'app-shell',
  imports: [MatButtonModule, AppIcon, AppThemePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShell {
  readonly employeeCount = input(0);
  readonly activeSection = model('overview');
  protected readonly navigation: ReadonlyArray<{ id: string; label: string; icon: IconName }> = [
    { id: 'overview', label: 'סקירה כללית', icon: 'grid' },
    { id: 'employees', label: 'עובדים', icon: 'users' },
    { id: 'new-employee', label: 'הוספת עובד', icon: 'file' },
    { id: 'components', label: 'רכיבים נוספים', icon: 'layers' },
  ];
  protected readonly currentSection = computed(
    () => this.navigation.find((item) => item.id === this.activeSection())?.label ?? 'סקירה כללית',
  );
}
