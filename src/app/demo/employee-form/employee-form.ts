import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppCard } from '../../shared/ui/card/card';
import { AppIcon } from '../../shared/ui/icon/icon';
import { DEPARTMENTS, Employee } from '../employees';

@Component({
  selector: 'app-employee-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AppCard,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class AppEmployeeForm {
  readonly existingEmails = input<ReadonlyArray<string>>([]);
  readonly employeeAdded = output<Omit<Employee, 'id' | 'status'>>();
  protected readonly departments = DEPARTMENTS;
  protected readonly employeeForm = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['operations', Validators.required],
    role: ['', Validators.required],
  });

  protected addEmployee(): void {
    const raw = this.employeeForm.getRawValue();
    this.employeeForm.patchValue({
      name: raw.name.trim(),
      email: raw.email.trim(),
      role: raw.role.trim(),
    });
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    const value = this.employeeForm.getRawValue();
    if (this.existingEmails().some((email) => email.toLowerCase() === value.email.toLowerCase())) {
      this.employeeForm.controls.email.setErrors({ duplicate: true });
      this.employeeForm.controls.email.markAsTouched();
      return;
    }
    const department = DEPARTMENTS.find((item) => item.id === value.department);
    if (!department) return;
    this.employeeAdded.emit({ ...value, department: department.id });
    this.employeeForm.reset({ name: '', email: '', department: 'operations', role: '' });
  }
}
