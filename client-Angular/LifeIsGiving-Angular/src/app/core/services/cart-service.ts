import { Injectable, computed, signal } from '@angular/core';
import { Prize } from '../models/Prize';
import { CartItem } from '../models/CartItem';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>(this.loadFromStorage());

  // חשיפה לקריאה בלבד
  items = computed(() => this._items());

  // badge
  totalQty = computed(() =>
    this._items().reduce((sum, it) => sum + it.qty, 0)
  );

  // סכום
  totalPrice = computed(() =>
    this._items().reduce((sum, it) => sum + it.qty * (it.prize.price ?? 0), 0)
  );

  add(prize: Prize, qty: number = 1) {
    const items = this._items();
    const idx = items.findIndex(i => i.prize.id === prize.id);

    let next: CartItem[];
    if (idx === -1) {
      next = [...items, { prize, qty }];
    } else {
      next = items.map((it, i) =>
        i === idx ? { ...it, qty: it.qty + qty } : it
      );
    }

    this._items.set(next);
    this.saveToStorage(next);
  }

  remove(prizeId: number) {
    const next = this._items().filter(i => i.prize.id !== prizeId);
    this._items.set(next);
    this.saveToStorage(next);
  }

  setQty(prizeId: number, qty: number) {
    const safeQty = Math.max(1, Math.floor(qty || 1));
    const next = this._items().map(it =>
      it.prize.id === prizeId ? { ...it, qty: safeQty } : it
    );
    this._items.set(next);
    this.saveToStorage(next);
  }

  clear() {
    this._items.set([]);
    this.saveToStorage([]);
  }

  private saveToStorage(items: CartItem[]) {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch {}
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem('cart');
      if (!raw) return [];
      const parsed = JSON.parse(raw) as CartItem[];
      // הגנה בסיסית
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
