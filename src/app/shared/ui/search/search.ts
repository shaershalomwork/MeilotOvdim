import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../icon/icon';

@Component({
  selector: 'app-search',
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label
      ><app-icon name="search" />
      <input
        type="search"
        [attr.aria-label]="label()"
        [placeholder]="label()"
        [value]="value()"
        (input)="onInput($event)"
      />
    </label>
  `,
  styles: `
    :host {
      display: block;
      min-width: 180px;
    }
    label {
      display: flex;
      align-items: center;
      gap: var(--app-space-2);
      height: 38px;
      padding-inline: var(--app-space-3);
      border: 1px solid var(--app-border-strong);
      border-radius: var(--app-radius-control);
      background: var(--app-surface);
    }
    app-icon {
      width: 17px;
      height: 17px;
      color: var(--app-text-muted);
    }
    input {
      width: 100%;
      border: 0;
      outline: none;
      background: transparent;
      color: var(--app-text);
      font-size: var(--app-text-sm);
    }
    input::placeholder {
      color: var(--app-text-muted);
    }
    label:focus-within {
      border-color: var(--app-primary);
      outline: 2px solid var(--app-primary-soft);
    }
  `,
})
export class AppSearch {
  readonly label = input('חיפוש');
  readonly value = input('');
  readonly valueChange = output<string>();
  protected onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
