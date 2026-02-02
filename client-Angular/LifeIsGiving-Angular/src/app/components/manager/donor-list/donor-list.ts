import { Component, signal } from '@angular/core';
import { Donor } from '../../../core/models/Donor';
import { Users } from '../../../core/services/users';

// Reactive Forms
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';

// RxJS
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

type DonorEditForm = FormGroup<{
  name: FormControl<string>;
  userName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  address: FormControl<string>;
}>;

type DonorFilterForm = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  prizeName: FormControl<string>;
}>;

@Component({
  selector: 'app-donor-list',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './donor-list.html',
  styleUrl: './donor-list.scss',
})
export class DonorList {
  donors = signal<Donor[]>([]);

  // --- Edit dialog state ---
  editDialogVisible = signal(false);
  editingId = signal<number | null>(null);

  // --- Edit Form (typed) ---
  editForm: DonorEditForm;

  // ===== Filter Form (NEW) =====
  filterForm: DonorFilterForm;

  constructor(
    private userService: Users,
    private fb: FormBuilder,
    private msg: MessageService
  ) {
    this.editForm = this.fb.nonNullable.group({
      name: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      userName: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
      phone: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(7),
      ]),
      address: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(2),
      ]),
    }) as DonorEditForm;

    // ✅ NEW: form for filtering
    this.filterForm = this.fb.nonNullable.group({
      name: this.fb.nonNullable.control(''),
      email: this.fb.nonNullable.control(''),
      prizeName: this.fb.nonNullable.control(''),
    }) as DonorFilterForm;
  }

  // ✅ NEW: normalize donors so prizesDonated is ALWAYS an array
  private normalizeDonors(list: Donor[]): Donor[] {
    return list.map((d: any) => ({
      ...d,
      prizesDonated: d.prizesDonated ?? [],
    })) as Donor[];
  }

  ngOnInit(): void {
    this.userService.donors$.subscribe({
      next: (donors) => this.donors.set(this.normalizeDonors(donors)),
      error: (err) => console.error('Error loading donors:', err),
    });

    // ✅ NEW: debounce filter requests
    this.filterForm.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(() => this.applyFilter());
  }

  deleteDonor(id: number): void {
    if (confirm('Are you sure you want to delete this donor?')) {
      this.userService.DeleteUser(id).subscribe({
        next: () => {
          this.userService.triggerDonorsRefresh();
          this.msg.add({
            severity: 'success',
            summary: 'נמחק',
            detail: 'התורם נמחק בהצלחה',
          });
        },
        error: (err) => {
          console.error('Error deleting donor:', err);
          this.msg.add({
            severity: 'error',
            summary: 'שגיאה',
            detail: 'מחיקה נכשלה',
          });
        },
      });
    }
  }

  // --- Open dialog with donor data ---
  openEditDialog(donor: Donor): void {
    this.editingId.set(donor.id as any);

    this.editForm.reset({
      name: donor.name ?? '',
      userName: (donor as any).userName ?? '',
      email: donor.email ?? '',
      phone: donor.phone ?? '',
      address: donor.address ?? '',
    });

    this.editDialogVisible.set(true);
    this.editForm.markAsPristine();
    this.editForm.markAsUntouched();
  }

  closeEditDialog(): void {
    this.editDialogVisible.set(false);
    this.editingId.set(null);
  }

  saveEdit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.msg.add({
        severity: 'warn',
        summary: 'חסרים פרטים',
        detail: 'בדקי את השדות המסומנים',
      });
      return;
    }

    const id = this.editingId();
    if (id == null) return;

    const updated = {
      ...this.editForm.getRawValue(),
      id,
    };

    this.userService.UpdateUser(String(id), updated).subscribe({
      next: () => {
        const current = this.donors();
        const idx = current.findIndex((d: any) => d.id === id);
        if (idx !== -1) {
          const merged = { ...current[idx], ...updated };
          const copy = [...current];
          copy[idx] = merged as any;
          this.donors.set(copy);
        }

        this.closeEditDialog();

        this.msg.add({
          severity: 'success',
          summary: 'נשמר',
          detail: 'הפרטים עודכנו בהצלחה',
        });
      },
      error: (err) => {
        console.error('Error updating donor:', err);
        this.msg.add({
          severity: 'error',
          summary: 'שגיאה',
          detail: 'שמירה נכשלה',
        });
      },
    });
  }

  // ===== Filter logic (NEW) =====
  applyFilter(): void {
    const name = this.filterForm.controls.name.value;
    const email = this.filterForm.controls.email.value;
    const prizeName = this.filterForm.controls.prizeName.value;

    const hasAny = !!name.trim() || !!email.trim() || !!prizeName.trim();

    if (!hasAny) {
      // חוזר למקור
      this.userService.triggerDonorsRefresh();
      return;
    }

    // חייב להיות לך ב-service: filterDonors(name,email,prizeName)
    this.userService.filterDonors(name, email, prizeName).subscribe({
      next: (filtered) => this.donors.set(this.normalizeDonors(filtered)),
      error: (err) => console.error('Error filtering donors:', err),
    });
  }

  clearFilter(): void {
    this.filterForm.reset({ name: '', email: '', prizeName: '' });
    this.userService.triggerDonorsRefresh();
  }

  // Helper לשגיאות תצוגה
  hasError(ctrlName: keyof DonorEditForm['controls'], err: string): boolean {
    const c = this.editForm.controls[ctrlName];
    return c.touched && c.hasError(err);
  }
}
