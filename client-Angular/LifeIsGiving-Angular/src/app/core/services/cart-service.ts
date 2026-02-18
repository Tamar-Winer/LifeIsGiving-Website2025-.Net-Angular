import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Prize } from '../models/Prize'; // ודאי נתיב נכון

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:5006/api/Purchases';
  private _items = signal<any[]>([]);

  items = computed(() => this._items());

  // חישוב כמות כוללת - תומך ב-Quantity ו-quantity
  totalQty = computed(() => this._items().reduce((sum, it) => sum + (it.quantity || it.Quantity || 0), 0));

// cart-service.ts

// 1. עדכון חישוב המחיר הכולל (משתמש בשדות מה-PurchaseDto)
totalPrice = computed(() => {
  return this._items().reduce((sum, it) => {
    const price = it.priceAtPurchase || 0;
    const qty = it.quantity || 0;
    return sum + (qty * price);
  }, 0);
});

// 2. עדכון כמות - עכשיו זה יעבוד כי יש PrizeId!
updateQuantity(item: any, delta: number) {
  // item.prizeId יגיע מה-DTO המעודכן בשרת
  const pId = item.prizeId || item.PrizeId;

  if (!pId) {
    console.error('Missing PrizeId! Did you update the C# DTO?', item);
    return;
  }

  this.add(pId, delta).subscribe({
    next: () => this.refreshCart(),
    error: (err) => console.error('Update failed', err)
  });
}
  constructor(private http: HttpClient) {
    this.refreshCart();
  }

  private getOptions() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  refreshCart() {
    this.http.get<any[]>(`${this.apiUrl}/draft`, this.getOptions()).subscribe({
      next: (data) => this._items.set(data),
      error: (err) => console.error('Refresh failed', err)
    });
  }

 // cart-service.ts

add(prizeOrId: any, quantity: number): Observable<any> {
  const prizeId = (prizeOrId && typeof prizeOrId === 'object') 
    ? (prizeOrId.id || prizeOrId.Id) 
    : prizeOrId;

  const body = { prizeId, quantity };

  // אנחנו משתמשים ב-pipe(tap) כדי לרענן את הסל ברגע שההוספה הצליחה
  return this.http.post(`${this.apiUrl}`, body, this.getOptions()).pipe(
    tap(() => this.refreshCart()) // זה ידאג שה-Badge ב-Navbar יגדל מיד!
  );
}

// cart-service.ts

// cart-service.ts



// בתוך cart-service.ts

remove(purchaseId: number) {
  // חייבים להוסיף את this.getOptions() בסוף!
  this.http.delete(`${this.apiUrl}/${purchaseId}`, this.getOptions()).subscribe({
    next: () => {
      console.log('Deleted successfully');
      this.refreshCart();
    },
    error: (err) => {
      console.error('מחיקה נכשלה! ודאי שאת מחוברת למערכת', err);
    }
  });
}

  clear() {
    this._items().forEach(item => {
      this.http.delete(`${this.apiUrl}/${item.id || item.Id}`, this.getOptions()).subscribe({
        next: () => this.refreshCart()
      });
    });
  }

  checkout() {
    this._items().forEach(item => {
      this.http.post(`${this.apiUrl}/complete/${item.id || item.Id}`, {}, this.getOptions()).subscribe({
        next: () => this.refreshCart()
      });
    });
  }
}