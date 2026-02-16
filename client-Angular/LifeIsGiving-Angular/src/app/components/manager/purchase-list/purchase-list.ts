import { Component, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'; // הוספנו את DynamicDialogRef
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './purchase-list.html',
  styleUrl: './purchase-list.scss',
})
export class PurchaseList implements OnInit {
  purchases: any[] = [];

  constructor(
    @Optional() public config: DynamicDialogConfig,
    @Optional() public ref: DynamicDialogRef // הזרקה של הרפרנס לסגירה
  ) {}

  ngOnInit() {
    // הנתונים מגיעים מהפונקציה viewPurchases שב-PrizeList
    if (this.config && this.config.data && this.config.data.purchases) {
      this.purchases = this.config.data.purchases;
    }
  }

  // פונקציה לסגירת הדיאלוג בלחיצה על ה-X בעיצוב
  close() {
    if (this.ref) {
      this.ref.close();
    }
  }
}