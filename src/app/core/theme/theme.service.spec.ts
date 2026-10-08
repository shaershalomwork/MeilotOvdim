import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

describe('ThemeService', () => {
  let matches: boolean;
  let listeners: Set<(event: MediaQueryListEvent) => void>;

  beforeEach(() => {
    localStorage.clear();
    matches = false;
    listeners = new Set();
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        get matches() {
          return matches;
        },
        addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) =>
          listeners.add(listener),
        removeEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) =>
          listeners.delete(listener),
      })),
    );
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    localStorage.clear();
    document.documentElement.classList.remove('app-dark');
    delete document.documentElement.dataset['theme'];
  });

  function systemChangesTo(dark: boolean): void {
    matches = dark;
    listeners.forEach((listener) => listener({ matches: dark } as MediaQueryListEvent));
    TestBed.tick();
  }

  it('uses the device preference on first visit and follows device changes', () => {
    matches = true;
    const service = TestBed.inject(ThemeService);
    expect(service.preference()).toBe('system');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    systemChangesTo(false);
    expect(service.mode()).toBe('light');
    expect(document.documentElement.classList.contains('app-dark')).toBe(false);
  });

  it('restores a saved manual choice even when the device uses another mode', () => {
    matches = true;
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const service = TestBed.inject(ThemeService);
    expect(service.preference()).toBe('light');
    expect(service.mode()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it('persists manual choices and resumes device tracking when system is selected', () => {
    const service = TestBed.inject(ThemeService);
    service.setPreference('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    systemChangesTo(false);
    expect(service.mode()).toBe('dark');
    expect(document.documentElement.classList.contains('app-dark')).toBe(true);
    service.setPreference('system');
    expect(service.mode()).toBe('light');
    systemChangesTo(true);
    expect(service.mode()).toBe('dark');
  });

  it('falls back to the device for invalid saved preferences', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'unexpected');
    matches = true;
    expect(TestBed.inject(ThemeService).mode()).toBe('dark');
  });

  it('keeps mode selection working when browser storage is blocked', () => {
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('Blocked');
    });
    const service = TestBed.inject(ThemeService);
    expect(() => service.setPreference('dark')).not.toThrow();
    expect(service.mode()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('updates the root theme when another tab changes the preference', () => {
    const service = TestBed.inject(ThemeService);
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: THEME_STORAGE_KEY,
        newValue: 'dark',
        storageArea: window.localStorage,
      }),
    );
    TestBed.tick();
    expect(service.preference()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: THEME_STORAGE_KEY,
        newValue: null,
        storageArea: window.localStorage,
      }),
    );
    TestBed.tick();
    expect(service.preference()).toBe('system');
    expect(service.mode()).toBe('light');
  });

  it('removes the device listener when the service is destroyed', () => {
    TestBed.inject(ThemeService);
    expect(listeners.size).toBe(1);
    TestBed.resetTestingModule();
    expect(listeners.size).toBe(0);
  });
});
