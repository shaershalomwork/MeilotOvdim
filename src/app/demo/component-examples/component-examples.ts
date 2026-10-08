import { ChangeDetectionStrategy, Component, DestroyRef, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { AppCard } from '../../shared/ui/card/card';
import { ConfirmationService } from '../../shared/ui/confirm-dialog/confirmation.service';
import { AppEmptyState } from '../../shared/ui/empty-state/empty-state';
import { AppIcon } from '../../shared/ui/icon/icon';
import { AppStatusBadge } from '../../shared/ui/status-badge/status-badge';

@Component({
  selector: 'app-component-examples',
  imports: [MatButtonModule, MatTabsModule, AppCard, AppEmptyState, AppIcon, AppStatusBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component-examples.html',
  styleUrl: './component-examples.css',
})
export class AppComponentExamples {
  private readonly confirmation = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);
  readonly notice = output<{ message: string; tone: 'success' | 'neutral' }>();

  protected showNotice(message: string, tone: 'success' | 'neutral' = 'neutral'): void {
    this.notice.emit({ message, tone });
  }
  protected async openExampleDialog(): Promise<void> {
    try {
      const confirmed = await this.confirmation.confirm({
        title: 'אישור פעולה',
        message: 'זהו חלון אישור לדוגמה. האם להמשיך בביצוע הפעולה?',
        confirmLabel: 'כן, להמשיך',
      });
      if (confirmed && !this.destroyRef.destroyed)
        this.showNotice('הפעולה לדוגמה אושרה בהצלחה.', 'success');
    } catch {
      if (!this.destroyRef.destroyed)
        this.showNotice('לא ניתן לפתוח את החלון כרגע. אפשר לנסות שוב.');
    }
  }
}
