import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import {
  DEPARTMENTS,
  DEMO_EMPLOYEES,
  Employee,
  EmployeeStatus,
  EMPLOYEE_STATUSES,
} from './demo/employees';
import { AppCard } from './shared/ui/card/card';
import { ConfirmationService } from './shared/ui/confirm-dialog/confirmation.service';
import { AppPagination, PageChange } from './shared/ui/pagination/pagination';
import { AppShell } from './shared/layout/app-shell/app-shell';
import { AppEmployeeForm } from './demo/employee-form/employee-form';
import { AppComponentExamples } from './demo/component-examples/component-examples';
import { AppEmptyState } from './shared/ui/empty-state/empty-state';
import { AppIcon, IconName } from './shared/ui/icon/icon';
import { AppNotice, Notice } from './shared/ui/notice/notice';
import { AppPageHeader } from './shared/ui/page-header/page-header';
import { AppSearch } from './shared/ui/search/search';
import { AppStatCard } from './shared/ui/stat-card/stat-card';
import { AppStatusBadge } from './shared/ui/status-badge/status-badge';

@Component({
  imports: [
    RouterOutlet,
    MatButtonModule,
    AppShell,
    AppPagination,
    AppCard,
    AppEmptyState,
    AppIcon,
    AppNotice,
    AppPageHeader,
    AppSearch,
    AppStatCard,
    AppStatusBadge,
    AppEmployeeForm,
    AppComponentExamples,
  ],
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly confirmation = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private nextId = DEMO_EMPLOYEES.length + 1;
  protected readonly activeNav = signal('overview');
  protected readonly employees = signal<Employee[]>(
    DEMO_EMPLOYEES.map((employee) => ({ ...employee })),
  );
  protected readonly query = signal('');
  protected readonly statusFilter = signal<EmployeeStatus | 'all'>('all');
  protected readonly pageSize = signal(5);
  private readonly requestedPage = signal(0);
  protected readonly notice = signal<Notice | null>(null);
  protected readonly activity = signal([
    { text: 'מרחב העבודה מוכן לפעילות', detail: 'בפתיחת המסך', icon: 'check-circle' as IconName },
    {
      text: 'נתוני הדוגמה נטענו',
      detail: 'אפשר לחפש, לסנן ולהוסיף עובדים',
      icon: 'users' as IconName,
    },
  ]);
  protected readonly filteredEmployees = computed(() => {
    const query = this.query().trim().toLocaleLowerCase('he');
    return this.employees().filter(
      (employee) =>
        (this.statusFilter() === 'all' || employee.status === this.statusFilter()) &&
        `${employee.name} ${employee.email} ${employee.role} ${this.departmentLabel(employee.department)}`
          .toLocaleLowerCase('he')
          .includes(query),
    );
  });
  protected readonly pageIndex = computed(() =>
    Math.min(
      this.requestedPage(),
      Math.max(0, Math.ceil(this.filteredEmployees().length / this.pageSize()) - 1),
    ),
  );
  protected readonly visibleEmployees = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredEmployees().slice(start, start + this.pageSize());
  });
  protected readonly activeCount = computed(
    () => this.employees().filter((item) => item.status === 'active').length,
  );
  protected readonly pendingCount = computed(
    () => this.employees().filter((item) => item.status === 'pending').length,
  );
  protected readonly departmentCounts = computed(() =>
    DEPARTMENTS.map((department) => ({
      ...department,
      count: this.employees().filter((employee) => employee.department === department.id).length,
    })),
  );
  protected readonly departmentCount = computed(
    () => this.departmentCounts().filter((item) => item.count > 0).length,
  );
  protected readonly employeeEmails = computed(() =>
    this.employees().map((employee) => employee.email),
  );

  protected departmentLabel(id: string): string {
    return DEPARTMENTS.find((department) => department.id === id)?.label ?? id;
  }
  protected statusInfo(status: EmployeeStatus) {
    return EMPLOYEE_STATUSES[status];
  }
  protected initials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('');
  }
  protected setQuery(value: string): void {
    this.query.set(value);
    this.requestedPage.set(0);
  }
  protected setStatusFilter(value: EmployeeStatus | 'all'): void {
    this.statusFilter.set(value);
    this.requestedPage.set(0);
  }
  protected resetFilters(): void {
    this.setQuery('');
    this.setStatusFilter('all');
  }
  protected changePage(event: PageChange): void {
    this.pageSize.set(event.pageSize);
    this.requestedPage.set(event.pageIndex);
  }

  protected addEmployee(value: Omit<Employee, 'id' | 'status'>): void {
    const employee: Employee = { ...value, id: this.nextId++, status: 'pending' };
    this.employees.update((items) => [employee, ...items]);
    this.resetFilters();
    this.showNotice(`${employee.name} נוסף/ה לרשימת העובדים וממתין/ה לאישור.`, 'success');
    this.addActivity(`נוסף/ה עובד/ת: ${employee.name}`, 'users');
  }

  protected async removeEmployee(employee: Employee): Promise<void> {
    try {
      const confirmed = await this.confirmation.confirm({
        title: 'הסרת עובד מהתצוגה',
        message: `להסיר את ${employee.name} מנתוני הדוגמה? השינוי תקף לתצוגה הנוכחית בלבד.`,
        confirmLabel: 'הסרת עובד',
        tone: 'danger',
      });
      if (!confirmed || this.destroyRef.destroyed) return;
      this.employees.update((items) => items.filter((item) => item.id !== employee.id));
      this.showNotice(`${employee.name} הוסר/ה מהתצוגה.`, 'neutral');
      this.addActivity(`הוסר/ה עובד/ת: ${employee.name}`, 'users');
    } catch {
      if (!this.destroyRef.destroyed)
        this.showNotice('לא ניתן לפתוח את החלון כרגע. אפשר לנסות שוב.');
    }
  }
  protected showNotice(message: string, tone: 'success' | 'neutral' = 'neutral'): void {
    this.notice.set({ message, tone });
  }
  protected exportEmployees(): void {
    const rows = [
      ['שם', 'דוא״ל', 'מחלקה', 'תפקיד', 'סטטוס'],
      ...this.filteredEmployees().map((item) => [
        item.name,
        item.email,
        this.departmentLabel(item.department),
        item.role,
        EMPLOYEE_STATUSES[item.status].label,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row
          .map((cell) => {
            const safe = /^\s*[=+\-@]/.test(cell) ? `'${cell}` : cell;
            return `"${safe.replaceAll('"', '""')}"`;
          })
          .join(','),
      )
      .join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
    const link = this.document.createElement('a');
    link.href = url;
    link.download = 'employees-demo.csv';
    this.document.body.append(link);
    link.click();
    link.remove();
    this.document.defaultView?.setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.showNotice('רשימת העובדים שבתצוגה יוצאה לקובץ CSV.', 'success');
  }
  private addActivity(text: string, icon: IconName): void {
    this.activity.update((items) => [{ text, detail: 'כרגע', icon }, ...items].slice(0, 3));
  }
}
