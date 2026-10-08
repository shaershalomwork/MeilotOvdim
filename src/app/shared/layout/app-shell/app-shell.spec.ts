import { Component } from '@angular/core';
import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AppShell, ShellNavigationItem } from './app-shell';

@Component({ template: '' })
class TestScreen {}

describe('Configurable shell navigation', () => {
  let fixture: ComponentFixture<AppShell>;
  let element: HTMLElement;
  const navigation: ReadonlyArray<ShellNavigationItem> = [
    { path: '/reports', label: 'דוחות', icon: 'file' },
    { path: '/settings', label: 'הגדרות', icon: 'layers' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShell],
      deferBlockBehavior: DeferBlockBehavior.Manual,
      providers: [
        provideRouter([
          { path: 'reports', component: TestScreen },
          { path: 'settings', component: TestScreen },
        ]),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppShell);
    element = fixture.nativeElement;
    fixture.componentRef.setInput('navigation', navigation);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('uses supplied routes and tracks the active link as the URL changes', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/reports');
    fixture.detectChanges();
    await fixture.whenStable();
    const reports = element.querySelector<HTMLAnchorElement>('nav a[href="/reports"]')!;
    const settings = element.querySelector<HTMLAnchorElement>('nav a[href="/settings"]')!;
    expect(reports.textContent).toContain('דוחות');
    expect(reports.getAttribute('aria-current')).toBe('page');
    expect(settings.getAttribute('aria-current')).toBeNull();

    await router.navigateByUrl('/settings');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(settings.getAttribute('aria-current')).toBe('page');
    expect(reports.getAttribute('aria-current')).toBeNull();
  });

  it('removes the sidebar and its reserved space when navigation is cleared', async () => {
    expect(element.querySelector('aside')).not.toBeNull();
    expect(element.querySelector('.workspace')?.classList.contains('with-sidebar')).toBe(true);
    fixture.componentRef.setInput('navigation', []);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.querySelector('aside')).toBeNull();
    expect(element.querySelector('.workspace')?.classList.contains('with-sidebar')).toBe(false);
    expect(element.querySelector('header .header-brand')).not.toBeNull();
  });
});
