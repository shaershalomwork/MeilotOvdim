import { inject, Injectable, Injector } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { ConfirmDialogData } from './confirm-dialog';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private readonly injector = inject(Injector);

  async confirm(data: ConfirmDialogData): Promise<boolean> {
    const [{ MatDialog }, { AppConfirmDialog }] = await Promise.all([
      import('@angular/material/dialog'),
      import('./confirm-dialog'),
    ]);
    const dialog = this.injector.get(MatDialog).open(AppConfirmDialog, {
      width: '440px',
      direction: 'rtl',
      autoFocus: '[data-dialog-cancel]',
      ariaModal: true,
      data,
    });
    return (await firstValueFrom(dialog.afterClosed())) === true;
  }
}
