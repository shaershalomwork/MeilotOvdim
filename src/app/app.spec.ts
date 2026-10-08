import {
  ComponentFixture,
  DeferBlockBehavior,
  DeferBlockState,
  TestBed,
} from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { ConfirmationService } from './shared/ui/confirm-dialog/confirmation.service';

describe('Employee dashboard examples', () => {
  let fixture: ComponentFixture<App>;
  let element: HTMLElement;
  const confirm = vi.fn<() => Promise<boolean>>();

  beforeEach(async () => {
    localStorage.clear();
    confirm.mockReset().mockResolvedValue(false);
    await TestBed.configureTestingModule({
      imports: [App],
      deferBlockBehavior: DeferBlockBehavior.Manual,
      providers: [provideRouter([]), { provide: ConfirmationService, useValue: { confirm } }],
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
  function rows(): NodeListOf<HTMLTableRowElement> {
    return element.querySelectorAll('tbody tr');
  }
  function input(selector: string, value: string): void {
    const field = element.querySelector<HTMLInputElement>(selector)!;
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }
  async function loadForm(): Promise<void> {
    const blocks = await fixture.getDeferBlocks();
    for (const block of blocks) await block.render(DeferBlockState.Complete);
    await settle();
  }
  async function submit(): Promise<void> {
    element
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await settle();
  }

  it('renders the shared summary cards and the first employee page', () => {
    expect(element.querySelector('h1')?.textContent).toContain('הכול במקום אחד');
    expect(element.querySelectorAll('app-stat-card').length).toBe(4);
    expect(rows().length).toBe(5);
    expect(element.querySelector('app-pagination')?.textContent).toContain('1–5 מתוך 8');
  });

  it('combines search and status filters, and lets the user clear an empty result', async () => {
    const filter = element.querySelector<HTMLSelectElement>('[aria-label="סינון לפי סטטוס"]')!;
    filter.value = 'pending';
    filter.dispatchEvent(new Event('change', { bubbles: true }));
    input('input[type="search"]', 'יעל');
    await settle();
    expect(rows().length).toBe(1);
    expect(rows()[0].textContent).toContain('יעל מזרחי');
    input('input[type="search"]', 'ללא התאמה');
    await settle();
    expect(rows().length).toBe(0);
    expect(element.querySelector('app-empty-state')?.textContent).toContain('לא נמצאו עובדים');
    const clear = Array.from(element.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('ניקוי מסננים'),
    )!;
    clear.click();
    await settle();
    expect(rows().length).toBe(5);
    expect(filter.value).toBe('all');
  });

  it('resets pagination when searching from the second page', async () => {
    element.querySelector<HTMLButtonElement>('[aria-label="לעמוד הבא"]')!.click();
    await settle();
    expect(rows().length).toBe(3);
    input('input[type="search"]', 'תמר');
    await settle();
    expect(rows().length).toBe(1);
    expect(element.querySelector('app-pagination')?.textContent).toContain('1–1 מתוך 1');
  });

  it('validates the form and adds a pending employee to the table and summary', async () => {
    await loadForm();
    await submit();
    expect(element.querySelectorAll('mat-error').length).toBeGreaterThan(0);
    expect(rows().length).toBe(5);
    input('[formControlName="name"]', '  עובד בדיקה  ');
    input('[formControlName="email"]', 'new@example.com');
    input('[formControlName="role"]', 'בודק תוכנה');
    await submit();
    expect(rows()[0].textContent).toContain('עובד בדיקה');
    expect(rows()[0].textContent).toContain('ממתין לאישור');
    expect(element.querySelector('app-stat-card')?.textContent).toContain('9');
    expect(element.querySelector('[role="status"]')?.textContent).toContain('נוסף/ה לרשימת');
  });

  it('rejects a duplicate email without adding another employee', async () => {
    await loadForm();
    input('[formControlName="name"]', 'עובד נוסף');
    input('[formControlName="email"]', 'TAMAR@EXAMPLE.COM');
    input('[formControlName="role"]', 'רכז');
    await submit();
    expect(element.textContent).toContain('כתובת הדוא״ל כבר קיימת ברשימה');
    expect(element.querySelector('app-pagination')?.textContent).toContain('מתוך 8');
  });

  it('removes an employee only after the confirmation returns true', async () => {
    element.querySelector<HTMLButtonElement>('[aria-label="הסרת תמר לוי"]')!.click();
    await settle();
    expect(element.querySelector('tbody')?.textContent).toContain('תמר לוי');
    confirm.mockResolvedValueOnce(true);
    element.querySelector<HTMLButtonElement>('[aria-label="הסרת תמר לוי"]')!.click();
    await settle();
    expect(element.querySelector('tbody')?.textContent).not.toContain('תמר לוי');
    expect(element.querySelector('app-pagination')?.textContent).toContain('מתוך 7');
  });

  it('returns to a valid page after removing the last rows of the second page', async () => {
    confirm.mockResolvedValue(true);
    element.querySelector<HTMLButtonElement>('[aria-label="לעמוד הבא"]')!.click();
    await settle();
    for (let index = 0; index < 3; index++) {
      rows()[0].querySelector('button')!.click();
      await settle();
    }
    expect(rows().length).toBe(5);
    expect(element.querySelector('app-pagination')?.textContent).toContain('1–5 מתוך 5');
  });

  it('changes and persists the display mode through the header menu', async () => {
    await loadForm();
    element.querySelector<HTMLButtonElement>('[aria-label="בחירת מצב תצוגה"]')!.click();
    await settle();
    const dark = Array.from(document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')).find(
      (button) => button.textContent?.includes('מצב כהה'),
    )!;
    dark.click();
    await settle();
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem('meilot-ovdim.theme')).toBe('dark');
    expect(element.querySelector('[aria-label="בחירת מצב תצוגה"]')?.textContent).toContain(
      'מצב כהה',
    );
  });
});
