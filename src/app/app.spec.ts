import { Component } from '@angular/core';
import {
  ComponentFixture,
  DeferBlockBehavior,
  DeferBlockState,
  TestBed,
} from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { THEME_STORAGE_KEY } from './core/theme/theme.service';

@Component({ template: '<h1>מסך בדיקה</h1>' })
class TestScreen {}

describe('Application shell', () => {
  let fixture: ComponentFixture<App>;
  let element: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      deferBlockBehavior: DeferBlockBehavior.Manual,
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    element = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('app-dark');
    delete document.documentElement.dataset['theme'];
  });

  async function settle(): Promise<void> {
    await Promise.resolve();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('renders an empty content area without demonstration screens or navigation', () => {
    expect(element.querySelector('app-shell')).not.toBeNull();
    expect(element.querySelector('#main-content router-outlet')).not.toBeNull();
    expect(
      element.querySelector(
        'table, form, app-stat-card, app-employee-form, app-component-examples',
      ),
    ).toBeNull();
    expect(element.querySelector('aside, nav')).toBeNull();
    expect(element.textContent).not.toContain('סביבת הדגמה');
    expect(element.textContent).not.toContain('משתמש לדוגמה');
    expect(element.querySelector('.workspace')?.classList.contains('with-sidebar')).toBe(false);
  });

  it('changes and persists display mode through the header on the empty app', async () => {
    for (const block of await fixture.getDeferBlocks()) {
      await block.render(DeferBlockState.Complete);
    }
    await settle();
    element.querySelector<HTMLButtonElement>('[aria-label="בחירת מצב תצוגה"]')!.click();
    await settle();
    const dark = Array.from(document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')).find(
      (button) => button.textContent?.includes('מצב כהה'),
    )!;
    dark.click();
    await settle();
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(element.querySelector('[aria-label="בחירת מצב תצוגה"]')?.textContent).toContain(
      'מצב כהה',
    );
  });

  it('renders application routes inside the retained content outlet', async () => {
    const router = TestBed.inject(Router);
    router.resetConfig([{ path: 'test', component: TestScreen }]);
    await router.navigateByUrl('/test');
    await settle();
    expect(element.querySelector('#main-content h1')?.textContent).toBe('מסך בדיקה');
    expect(element.querySelector('header')).not.toBeNull();
  });
});
