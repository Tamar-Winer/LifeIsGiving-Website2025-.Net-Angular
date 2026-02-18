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
  imports: [CommonModule, RouterModule, Card, Button, Divider, Toast],
  providers: [MessageService],
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
          severity: 'success',
          summary: 'success',
          detail: `נוסף לסל שלך "${prize.name}" הפרס`,
          life: 3000 // ייעלם אחרי 3 שניות
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'שגיאה',
          detail: 'לא הצלחנו להוסיף את הפריט לסל'
        });
      }
    });
  }
}