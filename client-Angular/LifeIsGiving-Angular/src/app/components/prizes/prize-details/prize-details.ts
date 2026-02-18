import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PrizeService } from '../../../core/services/prize-service';
import { Prize } from '../../../core/models/Prize';

import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Skeleton } from 'primeng/skeleton';
import { CartService } from '../../../core/services/cart-service';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";

@Component({
  selector: 'app-prize-details',
  standalone: true, // וודאי שזה standalone אם את משתמשת ב-imports
  imports: [CommonModule, RouterModule, Card, Button, Toast], // ה-Toast חייב להיות כאן!
  providers: [MessageService], // המופע הזה חייב להיות תואם ל-Toast ב-HTML
  templateUrl: './prize-details.html',
  styleUrls: ['./prize-details.scss'],
})
export class PrizeDetails {
  prize: Prize | null = null;
categoryNames: { [key: number]: string } = {
    1: 'Toys',
    2: 'Electronics',
    3: 'Fashion',
    4: 'Cosmetics',
    5: 'Home',
    6: 'Experiences'
  };
  constructor(
    private route: ActivatedRoute,
    private prizeService: PrizeService,
    private cdr: ChangeDetectorRef,
    private cart: CartService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.prizeService.getPrizeById(id).subscribe({
          next: prize => {
            this.prize = prize;
            this.cdr.detectChanges();
          },
          error: err => console.error('Error loading prize:', err)
        });
      }
    });
  }

 
  addToCart(prize: Prize, ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    
    this.cart.add(prize, 1).subscribe({
      next: () => { 
        // ההודעה היפה והמעוצבת
       this.messageService.add({
    severity: 'custom', // מאפשר לנו שליטה מלאה
    summary: 'Success',
    detail: `"${prize.name}" added to your bag`,
    life: 3000,
    icon: 'pi pi-shopping-bag'
});
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add item to cart'
        });
      }
    });
  }
}