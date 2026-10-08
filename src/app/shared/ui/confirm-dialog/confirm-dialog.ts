import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AppIcon } from '../icon/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatButtonModule, MatDialogModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-icon" [class.danger]="data.tone === 'danger'">
      <app-icon [name]="data.tone === 'danger' ? 'trash' : 'check-circle'" />
    </div>
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content
      ><p>{{ data.message }}</p></mat-dialog-content
    >
    <mat-dialog-actions align="end">
      <button mat-stroked-button type="button" data-dialog-cancel [mat-dialog-close]="false">
        {{ data.cancelLabel || 'ביטול' }}
      </button>
      <button
        mat-flat-button
        type="button"
        [mat-dialog-close]="true"
        [class.app-danger-action]="data.tone === 'danger'"
      >
        {{ data.confirmLabel || 'אישור' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .dialog-icon {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      margin: 24px 24px 0;
      color: var(--app-on-primary-soft);
      background: var(--app-primary-soft);
      border-radius: var(--app-radius-control);
    }
    .dialog-icon.danger {
      color: var(--app-danger);
      background: var(--app-danger-soft);
    }
    p {
      margin: 0;
      line-height: 1.8;
    }
    mat-dialog-actions {
      gap: var(--app-space-2);
      padding: 16px 24px 24px;
    }
  `,
})
export class AppConfirmDialog {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
