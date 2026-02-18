import { Component, signal, OnInit } from '@angular/core';
import { Donor } from '../../../core/models/Donor';
import { Users } from '../../../core/services/users';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'; // הסרנו את ConfirmationService כי משתמשים בטוסט
import { AddDonor } from '../add-donor/add-donor';

type DonorEditForm = FormGroup<{
  name: FormControl<string>;
  userName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  address: FormControl<string>;
}>;

@Component({
  selector: 'app-donor-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    AddDonor
  ],
  providers: [MessageService],
  templateUrl: './donor-list.html',
  styleUrl: './donor-list.scss',
})
export class DonorList implements OnInit {
  donors = signal<Donor[]>([]);
  showAddDialog = false;
  editDialogVisible = signal(false);
  editingId = signal<number | null>(null);
  editForm: DonorEditForm;
  filterForm: any;

  constructor(
    private userService: Users,
    private fb: FormBuilder,
    private msg: MessageService
  ) {
    this.editForm = this.fb.nonNullable.group({
      name: this.fb.nonNullable.control('', [Validators.required]),
      userName: this.fb.nonNullable.control('', [Validators.required]),
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      phone: this.fb.nonNullable.control('', [Validators.required]),
      address: this.fb.nonNullable.control('', [Validators.required]),
    }) as DonorEditForm;

    this.filterForm = this.fb.nonNullable.group({
      name: this.fb.nonNullable.control(''),
      email: this.fb.nonNullable.control(''),
      prizeName: this.fb.nonNullable.control(''),
    });
  }

  ngOnInit(): void {
    this.loadDonorsInitial();
    this.filterForm.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe(() => this.applyFilter());
  }

  private loadDonorsInitial(): void {
    this.userService.donors$.subscribe({
      next: (users: any[]) => {
        // רק מי שה-Role שלו הוא 1 (תורם)
        const onlyDonors = users.filter(u => u.role === 1);
        this.donors.set(this.normalizeDonors(onlyDonors));
      },
    });
  }

  private normalizeDonors(list: Donor[]): Donor[] {
    return list.map((d: any) => ({ ...d, prizesDonated: d.prizesDonated ?? [] }));
  }

  // --- לוגיקת מחיקה דרך טוסט יוקרתי ---

  deleteDonor(id: number): void {
    // פתיחת טוסט אישור
    this.msg.add({
      key: 'confirmDelete',
      sticky: true,
      severity: 'warn',
      summary: 'Delete Donor?',
      detail: 'This action cannot be undone.',
      data: id 
    });
  }

  onConfirmDelete(id: number) {
    this.userService.DeleteUser(id).subscribe({
      next: () => {
        this.userService.triggerDonorsRefresh();
        this.msg.clear('confirmDelete');
        this.msg.add({ 
          severity: 'success', 
          summary: 'Deleted', 
          detail: 'Donor has been removed successfully', 
          life: 3000 
        });
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete donor' });
      }
    });
  }

  onRejectDelete() {
    this.msg.clear('confirmDelete');
  }

  // --- עריכה וסינון ---
applyFilter(): void {
  const { name, email, prizeName } = this.filterForm.getRawValue();
  
  // אנחנו תמיד נרצה לסנן מתוך הרשימה המקורית המלאה של ה-Service
  this.userService.donors$.subscribe((allUsers: any[]) => {
    const filtered = allUsers.filter(u => {
      // 1. קודם כל - רק תורמים (Role 1)
      const isDonor = u.role === 1;
      
      // 2. סינון לפי שם
      const matchesName = !name || u.name?.toLowerCase().includes(name.toLowerCase());
      
      // 3. סינון לפי אימייל
      const matchesEmail = !email || u.email?.toLowerCase().includes(email.toLowerCase());
      
      // 4. סינון לפי שם פרס (בתוך מערך התרומות)
      const matchesPrize = !prizeName || u.prizesDonated?.some((p: any) => 
        p.name?.toLowerCase().includes(prizeName.toLowerCase())
      );

      return isDonor && matchesName && matchesEmail && matchesPrize;
    });

    // עדכון ה-Signal עם התוצאות (הפעם עם כל ה-Prizes בפנים!)
    this.donors.set(this.normalizeDonors(filtered));
  });
}

  openEditDialog(donor: Donor) {
    this.editingId.set(donor.id as any);
    this.editForm.patchValue({
      name: donor.name,
      userName: (donor as any).userName,
      email: donor.email,
      phone: donor.phone,
      address: donor.address
    });
    this.editDialogVisible.set(true);
  }

  closeEditDialog() {
    this.editDialogVisible.set(false);
    this.editingId.set(null);
  }

  saveEdit(): void {
    if (this.editForm.invalid) return;
    const id = this.editingId();
    if (!id) return;

    this.userService.UpdateUser(String(id), { ...this.editForm.getRawValue(), id }).subscribe({
      next: () => {
        this.userService.triggerDonorsRefresh();
        this.closeEditDialog();
        this.msg.add({ severity: 'success', summary: 'Success', detail: 'Donor updated' });
      }
    });
  }

  clearFilter() {
    this.filterForm.reset();
    this.loadDonorsInitial();
  }
}