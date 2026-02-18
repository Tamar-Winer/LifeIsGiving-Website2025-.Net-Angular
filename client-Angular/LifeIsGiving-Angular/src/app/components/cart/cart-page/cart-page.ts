import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CartService } from '../../../core/services/cart-service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.scss']
})
export class CartPage {
  // משתנים לניהול מצב התשלום וההצלחה
  isProcessing: boolean = false;
  showSuccess: boolean = false;

  constructor(public cart: CartService) {}

  /**
   * פונקציה המבצעת תשלום דמה, מרוקנת את הסל ומציגה הודעת הצלחה
   */
  onCheckout() {
    // אם הסל ריק, אין טעם להמשיך
    if (this.cart.items().length === 0) return;

    // 1. הפעלת מצב "עיבוד תשלום" (מסך טעינה)
    this.isProcessing = true;

    // 2. סימולציה של זמן המתנה (2.5 שניות)
    setTimeout(() => {
      this.isProcessing = false;
      this.showSuccess = true;

      // 3. ביצוע ה-Checkout בשרת (עדכון בסיס הנתונים)
      this.cart.checkout();

      // 4. ריקון מיידי של הרשימה ב-UI (כדי שהסל ייראה ריק ברקע)
      // הערה: ודאי שהוספת את הפונקציה clearItemsLocally לתוך ה-CartService שלך
      if (this.cart.clearItemsLocally) {
        this.cart.clearItemsLocally();
      }

      // 5. סגירה אוטומטית של הודעת ההצלחה אחרי 4 שניות
      setTimeout(() => {
        this.showSuccess = false;
      }, 4000);
      
    }, 2500);
  }
}