import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast'; 
import { ButtonModule } from 'primeng/button';

import { PrizeService } from '../../../core/services/prize-service';
import { Users } from '../../../core/services/users'; // ודאי שהנתיב נכון

@Component({
  selector: 'app-prize-edit-form',
  standalone: true,
  providers: [MessageService], 
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    InputNumberModule, 
    ToastModule, 
    ButtonModule
  ],
  templateUrl: './prize-edit-form.html',
  styleUrl: './prize-edit-form.scss',
})
export class PrizeEditForm implements OnInit {
  prizeForm: FormGroup;
  isEditMode: boolean = false;
  loading: boolean = false;
  selectedFileName: string = '';
  donors: any[] = []; // לאחסון רשימת התורמים
  selectedFile: File | null = null;

  categories = [
    { label: 'Toys', value: 1 },
    { label: 'Electronics', value: 2 },
    { label: 'Fashion', value: 3 },
    { label: 'Cosmetics', value: 4 },
    { label: 'Home', value: 5 },
    { label: 'Experiences', value: 6 }
  ];

  constructor(
    private fb: FormBuilder,
    private prizeService: PrizeService,
    private userService: Users, // הזרקת הסרוויס שלך
    private messageService: MessageService,
    @Optional() public ref: DynamicDialogRef, 
    @Optional() public config: DynamicDialogConfig,
  ) {
    this.prizeForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: [null, Validators.required],
      price: [null, Validators.required],
      imageUrl: [''],
      donorId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDonors(); // טעינת התורמים מיד עם פתיחת הטופס

    if (this.config?.data?.prize) {
      this.isEditMode = true;
      this.prizeForm.patchValue(this.config.data.prize);
    }
  }

  loadDonors() {
    this.userService.GetDonors().subscribe({
      next: (data) => {
        this.donors = data;
      },
      error: (err) => {
        console.error('Failed to load donors', err);
      }
    });
  }

  savePrize() {
    if (this.prizeForm.invalid) {
      this.prizeForm.markAllAsTouched(); 
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Incomplete Details', 
        detail: 'Please fill in all required fields.',
        life: 3000
      });
      return;
    }

    this.loading = true;
    const rawValues = this.prizeForm.value;
    const prizeToSave = {
      ...rawValues,
      id: this.isEditMode ? Number(rawValues.id) : 0,
      category: Number(rawValues.category),
      price: Number(rawValues.price),
      donorId: Number(rawValues.donorId),
      imageUrl: rawValues.imageUrl?.trim() || null
    };

    const request = this.isEditMode 
      ? this.prizeService.updatePrize(prizeToSave) 
      : this.prizeService.addPrize(prizeToSave);

    request.subscribe({
      // בתוך ה-next של ה-request.subscribe:
next: (res) => {
  this.messageService.add({ /* ... הגדרות הטוסט ... */ });

  setTimeout(() => {
    this.loading = false;
    
    // יצירת אובייקט שממזג: 
    // 1. את המידע המקורי (כולל winner, isDrawn וכו')
    // 2. את המידע החדש מהטופס
    // 3. את התשובה מהשרת (res) במידה והיא מכילה את האובייקט המעודכן
    
    const originalPrize = this.config?.data?.prize || {};
    const updatedFormValues = prizeToSave;

    const finalResult = {
      canPurchase: true,        // default for new prizes; overridden below if editing
      ...originalPrize,         // edit mode: real canPurchase from original prize
      ...updatedFormValues,
      ...(typeof res === 'object' ? res : {})
    };

    this.ref?.close(finalResult);
  }, 1200);
},
      error: (err) => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Action Failed', 
          detail: 'Something went wrong.',
          life: 4000 
        });
        console.error(err);
      }
    });
  }

  cancel() { if (this.ref) this.ref.close(); }
  closeDialog() { if (this.ref) this.ref.close(); }

  onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    this.selectedFileName = file.name;

    // העלאה מיידית לשרת
    const formData = new FormData();
    formData.append('file', file);

    // אנחנו צריכים להוסיף פונקציית uploadImage ב-PrizeService
    this.prizeService.uploadImage(formData).subscribe({
      next: (res: any) => {
        // עדכון השדה בטופס עם הכתובת שהתקבלה מהשרת
        this.prizeForm.patchValue({ imageUrl: res.url });
        this.messageService.add({ severity: 'info', summary: 'Image Uploaded', detail: 'Preview ready' });
      },
      error: (err) => console.error('Upload failed', err)
    });
  }
}

  
}