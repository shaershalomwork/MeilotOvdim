import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService } from './confirmation.service';
import { AppConfirmDialog } from './confirm-dialog';

describe('Shared confirmation dialog', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AppConfirmDialog] });
  });
  afterEach(() => {
    TestBed.inject(MatDialog).closeAll();
  });

  async function open(tone: 'default' | 'danger' = 'default') {
    const result = TestBed.inject(ConfirmationService).confirm({
      title: 'בדיקת אישור',
      message: 'האם להמשיך?',
      confirmLabel: 'להמשיך',
      tone,
    });
    await vi.waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull());
    return { result, dialog: document.querySelector<HTMLElement>('[role="dialog"]')! };
  }

  it('resolves false when canceled and focuses cancellation first', async () => {
    const { result, dialog } = await open('danger');
    const cancel = Array.from(dialog.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('ביטול'),
    )!;
    await vi.waitFor(() => expect(document.activeElement).toBe(cancel));
    cancel.click();
    expect(await result).toBe(false);
  });

  it('resolves true for confirmation, including when the root is in dark mode', async () => {
    document.documentElement.dataset['theme'] = 'dark';
    document.documentElement.classList.add('app-dark');
    const { result, dialog } = await open();
    expect(dialog.closest('html')).toBe(document.documentElement);
    const accept = Array.from(dialog.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('להמשיך'),
    )!;
    accept.click();
    expect(await result).toBe(true);
    document.documentElement.classList.remove('app-dark');
    delete document.documentElement.dataset['theme'];
  });

  it('resolves false when the dialog is closed with Escape', async () => {
    const { result, dialog } = await open();
    dialog.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }),
    );
    expect(await result).toBe(false);
  });
});
