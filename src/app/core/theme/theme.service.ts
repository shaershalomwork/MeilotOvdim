import { DOCUMENT } from '@angular/common';
import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ThemeMode = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'meilot-ovdim.theme';

function parsePreference(value: string | null): ThemePreference {
  return value === 'light' || value === 'dark' ? value : 'system';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly selected = signal<ThemePreference>('system');
  private readonly systemDark = signal(false);

  readonly preference = this.selected.asReadonly();
  readonly mode = computed<ThemeMode>(() => {
    const preference = this.selected();
    return preference === 'system' ? (this.systemDark() ? 'dark' : 'light') : preference;
  });

  constructor() {
    const view = this.document.defaultView;
    if (view) {
      let storage: Storage | undefined;
      try {
        storage = view.localStorage;
        this.selected.set(parsePreference(storage.getItem(THEME_STORAGE_KEY)));
      } catch {
        /* Fall back to the device preference when storage is blocked. */
      }

      const media = view.matchMedia?.('(prefers-color-scheme: dark)');
      this.systemDark.set(media?.matches ?? false);
      const onSystemChange = (event: MediaQueryListEvent) => this.systemDark.set(event.matches);
      media?.addEventListener('change', onSystemChange);

      const onStorageChange = (event: StorageEvent) => {
        if (
          storage &&
          event.storageArea === storage &&
          (event.key === THEME_STORAGE_KEY || event.key === null)
        ) {
          this.selected.set(parsePreference(event.newValue));
        }
      };
      view.addEventListener('storage', onStorageChange);
      this.destroyRef.onDestroy(() => {
        media?.removeEventListener('change', onSystemChange);
        view.removeEventListener('storage', onStorageChange);
      });
    }

    this.applyMode();
    effect(() => this.applyMode());
  }

  setPreference(preference: ThemePreference): void {
    this.selected.set(preference);
    try {
      this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      /* Keep the chosen theme for this session even if persistence is unavailable. */
    }
    this.applyMode();
  }

  private applyMode(): void {
    const root = this.document.documentElement;
    const mode = this.mode();
    root.dataset['theme'] = mode;
    root.classList.toggle('app-dark', mode === 'dark');
  }
}
