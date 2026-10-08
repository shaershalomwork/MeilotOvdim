import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../icon/icon';

export interface Notice {
  message: string;
  tone: 'success' | 'neutral';
}

@Component({
  selector: 'app-notice',
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' },
  template: `
    @if (notice(); as feedback) {
      <div class="feedback" [class.success]="feedback.tone === 'success'">
        <app-icon [name]="feedback.tone === 'success' ? 'check-circle' : 'info'" />
        <span>{{ feedback.message }}</span>
        <button type="button" (click)="dismissed.emit()" aria-label="סגירת הודעה">
          <app-icon name="close" />
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      position: fixed;
      bottom: 24px;
      inset-inline-end: 24px;
      z-index: 40;
      max-width: calc(100vw - 280px);
    }
    .feedback {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 18px;
      border: 1px solid var(--app-border-strong);
      border-radius: var(--app-radius-control);
      background: var(--app-surface);
      color: var(--app-text);
      box-shadow: var(--app-shadow-card);
    }
    .feedback.success {
      background: var(--app-success-soft);
      color: var(--app-success);
    }
    button {
      display: flex;
      margin-inline-start: 12px;
      padding: 4px;
      border: 0;
      background: transparent;
      color: inherit;
    }
    button app-icon {
      width: 16px;
      height: 16px;
    }
  `,
})
export class AppNotice {
  readonly notice = input<Notice | null>(null);
  readonly dismissed = output<void>();
}
