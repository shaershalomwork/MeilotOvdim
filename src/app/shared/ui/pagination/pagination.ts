import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AppIcon } from '../icon/icon';

export interface PageChange {
  pageIndex: number;
  pageSize: number;
}

@Component({
  selector: 'app-pagination',
  imports: [MatButtonModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label
      >שורות בעמוד
      <select aria-label="שורות בעמוד" [value]="pageSize()" (change)="resize($event)">
        @for (size of pageSizes(); track size) {
          <option [value]="size">{{ size }}</option>
        }
      </select></label
    >
    <span>{{ range() }}</span>
    <button
      mat-icon-button
      type="button"
      aria-label="לעמוד הקודם"
      [disabled]="pageIndex() === 0"
      (click)="pageChange.emit({ pageIndex: pageIndex() - 1, pageSize: pageSize() })"
    >
      <app-icon name="arrow-left" class="previous" />
    </button>
    <button
      mat-icon-button
      type="button"
      aria-label="לעמוד הבא"
      [disabled]="(pageIndex() + 1) * pageSize() >= length()"
      (click)="pageChange.emit({ pageIndex: pageIndex() + 1, pageSize: pageSize() })"
    >
      <app-icon name="arrow-left" />
    </button>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 12px;
      color: var(--app-text-muted);
      font-size: var(--app-text-xs);
    }
    label {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    select {
      padding: 4px 8px;
      border: 1px solid var(--app-border-strong);
      border-radius: var(--app-radius-control);
      background: var(--app-surface);
      color: var(--app-text);
    }
    button {
      color: var(--app-text-muted);
    }
    app-icon {
      width: 16px;
      height: 16px;
    }
    .previous {
      transform: rotate(180deg);
    }
  `,
})
export class AppPagination {
  readonly length = input.required<number>();
  readonly pageIndex = input(0);
  readonly pageSize = input(5);
  readonly pageSizes = input<ReadonlyArray<number>>([5, 10, 20]);
  readonly pageChange = output<PageChange>();
  protected readonly range = computed(() =>
    this.length()
      ? `${this.pageIndex() * this.pageSize() + 1}–${Math.min((this.pageIndex() + 1) * this.pageSize(), this.length())} מתוך ${this.length()}`
      : '0 מתוך 0',
  );
  protected resize(event: Event): void {
    this.pageChange.emit({
      pageIndex: 0,
      pageSize: Number((event.target as HTMLSelectElement).value),
    });
  }
}
