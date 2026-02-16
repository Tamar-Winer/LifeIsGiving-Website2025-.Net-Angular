import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
// ייבוא המודולים של PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast'; // חסר היה ונשלח עכשיו לתיקון השגיאה
import { ButtonModule } from 'primeng/button';

import { PrizeService } from '../../../core/services/prize-service';

@Component({
  selector: 'app-prize-edit-form',
  standalone: true,
  providers: [MessageService], 
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    InputNumberModule, 
    ToastModule, // כאן התיקון לשגיאה NG8001
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

  constructor(
    private fb: FormBuilder,
    private prizeService: PrizeService,
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
    if (this.config?.data?.prize) {
      this.isEditMode = true;
      this.prizeForm.patchValue(this.config.data.prize);
    }
  }

  

savePrize() {
  // 1. אם הטופס לא תקין - אל תשלח לשרת, פשוט תראה למשתמש איפה הטעות
  if (this.prizeForm.invalid) {
    this.prizeForm.markAllAsTouched(); // צובע את השדות הבעייתיים
    this.messageService.add({ 
      severity: 'warn', 
      summary: 'Missing Info', 
      detail: 'Please fill all required fields correctly.' 
    });
    return;
  }

  // 2. אם הכל תקין - ממשיכים לשמירה
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
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Saved!' });
      setTimeout(() => {
        this.loading = false;
        this.ref?.close(res);
      }, 1000);
    },
    error: (err) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Check server connection' });
      console.error(err);
    }
  });
}

  cancel() {
    if (this.ref) {
      this.ref.close();
    }
  }

  closeDialog() {
  this.ref.close(); // סוגר את הדיאלוג וחוזר לעמוד הפרסים
}

onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.selectedFileName = file.name;
    // כאן אפשר להפוך את הקובץ ל-Base64 או להעלות לשרת
    // דוגמה לעדכון ה-form:
    // this.prizeForm.patchValue({ imageUrl: 'נתיב זמני או שם הקובץ' });
  }}
}