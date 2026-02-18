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
    if (this.prizeForm.invalid) {
      this.prizeForm.markAllAsTouched(); 
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Incomplete Details', 
        detail: 'Please fill in all required fields to continue.',
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
      next: (res) => {
        console.log('Server response:', res);

        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success!', 
          detail: this.isEditMode ? 'The prize has been updated.' : 'A new prize has been created.',
          life: 2000
        });
        
        setTimeout(() => {
          this.loading = false;
          
          let finalResult;
          
          if (!this.isEditMode) {
            // לוגיקה מיוחדת להוספה:
            // אם השרת החזיר אובייקט מלא, נשתמש בו. 
            // אם הוא החזיר רק מספר (ה-ID החדש), נמזג אותו לתוך הנתונים ששלחנו.
            if (res && typeof res === 'object') {
              finalResult = res;
            } else if (res && typeof res === 'number') {
              finalResult = { ...prizeToSave, id: res };
            } else {
              finalResult = prizeToSave;
            }
          } else {
            // בעריכה פשוט מחזירים את התוצאה או את מה ששלחנו
            finalResult = res && Object.keys(res).length > 0 ? res : prizeToSave;
          }

          this.ref?.close(finalResult);
        }, 1200);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Action Failed', 
          detail: 'Something went wrong. Please check your connection.',
          life: 4000 
        });
        console.error(err);
      }
    });
  }

  cancel() {
    if (this.ref) this.ref.close();
  }

  closeDialog() {
    if (this.ref) this.ref.close();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    }
  }
}