import { StatusTone } from '../shared/ui/status-badge/status-badge';

export type EmployeeStatus = 'active' | 'pending' | 'inactive';
export type DepartmentId = 'operations' | 'digital' | 'finance' | 'hr';
export interface Employee {
  id: number;
  name: string;
  email: string;
  department: DepartmentId;
  role: string;
  status: EmployeeStatus;
}
export const DEPARTMENTS: ReadonlyArray<{ id: DepartmentId; label: string }> = [
  { id: 'operations', label: 'תפעול ושירות' },
  { id: 'digital', label: 'דיגיטל וטכנולוגיה' },
  { id: 'finance', label: 'כספים' },
  { id: 'hr', label: 'משאבי אנוש' },
];
export const EMPLOYEE_STATUSES: Record<EmployeeStatus, { label: string; tone: StatusTone }> = {
  active: { label: 'פעיל', tone: 'success' },
  pending: { label: 'ממתין לאישור', tone: 'warning' },
  inactive: { label: 'לא פעיל', tone: 'neutral' },
};
export const DEMO_EMPLOYEES: ReadonlyArray<Employee> = [
  {
    id: 1,
    name: 'תמר לוי',
    email: 'tamar@example.com',
    department: 'hr',
    role: 'רכזת משאבי אנוש',
    status: 'active',
  },
  {
    id: 2,
    name: 'דניאל כהן',
    email: 'daniel@example.com',
    department: 'digital',
    role: 'מנהל פרויקטים',
    status: 'active',
  },
  {
    id: 3,
    name: 'יעל מזרחי',
    email: 'yael@example.com',
    department: 'finance',
    role: 'אנליסטית',
    status: 'pending',
  },
  {
    id: 4,
    name: 'איתי רוזן',
    email: 'itai@example.com',
    department: 'operations',
    role: 'מנהל צוות שירות',
    status: 'active',
  },
  {
    id: 5,
    name: 'נועה אברהם',
    email: 'noa@example.com',
    department: 'digital',
    role: 'מפתחת תוכנה',
    status: 'active',
  },
  {
    id: 6,
    name: 'אור בן דוד',
    email: 'or@example.com',
    department: 'operations',
    role: 'נציג שירות',
    status: 'pending',
  },
  {
    id: 7,
    name: 'שירה גולן',
    email: 'shira@example.com',
    department: 'finance',
    role: 'מנהלת חשבונות',
    status: 'active',
  },
  {
    id: 8,
    name: 'מיכאל הדר',
    email: 'michael@example.com',
    department: 'operations',
    role: 'רכז תפעול',
    status: 'inactive',
  },
];
