import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { CartService } from '../../../core/services/cart-service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, Card, Button, InputNumberModule],
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.scss'],
})
export class CartPage {
  constructor(public cart: CartService) {}

  trackById = (_: number, item: any) => item.prize.id;

  inc(item: any) {
    this.cart.setQty(item.prize.id, item.qty + 1);
  }

  dec(item: any) {
    this.cart.setQty(item.prize.id, item.qty - 1);
  }
}
