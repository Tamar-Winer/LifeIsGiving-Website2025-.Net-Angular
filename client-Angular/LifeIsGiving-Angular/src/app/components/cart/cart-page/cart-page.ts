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

constructor(public cart: CartService) {} // חייב להיות public
}