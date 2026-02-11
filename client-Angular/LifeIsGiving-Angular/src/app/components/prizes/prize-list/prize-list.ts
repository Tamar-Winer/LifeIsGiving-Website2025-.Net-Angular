import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PrizeService } from '../../../core/services/prize-service';
import { Prize } from '../../../core/models/Prize';

import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { CartService } from '../../../core/services/cart-service';
import { AuthService } from '../../../core/services/auth-service';

import confetti from 'canvas-confetti';

@Component({
  selector: 'app-prize-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Card, Button],
  templateUrl: './prize-list.html',
  styleUrls: ['./prize-list.scss']
})
export class PrizeList implements OnInit {
  prizes = signal<Prize[]>([]);

  private authService = inject(AuthService);
  private prizeService = inject(PrizeService);
  public cart = inject(CartService);

  // קריאה ישירה לפונקציה החדשה שיצרנו ב-AuthService
  isAdmin = signal<boolean>(false); 

  ngOnInit(): void {
    // עדכון סטטוס מנהל
    this.isAdmin.set(this.authService.isAdmin());

    this.prizeService.getAllPrizes().subscribe({
      next: (prizes) => this.prizes.set(prizes),
      error: (err) => console.error('Error loading prizes:', err)
    });
  }

  // --- פונקציות מנהל ---
  addPrize() {
    console.log('Navigating to Add Prize Form');
  }

  editPrize(prize: Prize, ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    console.log('Edit:', prize);
  }

 deletePrize(prizeId: number, ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    
    if (confirm('Are you sure you want to delete this prize?')) {
      this.prizeService.deletePrize(prizeId).subscribe({
        next: () => {
          // עדכון הסיגנל המקומי כדי שהפרס ייעלם מהמסך מיד
          this.prizes.set(this.prizes().filter(p => p.id !== prizeId));
          alert('Prize deleted successfully!');
        },
        error: () => alert('Error deleting prize')
      });
    }
  }
  // --- לוגיקה קיימת ---
  trackById(index: number, prize: Prize) { return prize.id; }
  toggleFavorite(prize: Prize, ev: MouseEvent) { ev.preventDefault(); ev.stopPropagation(); }

  addToCart(prize: Prize, ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this.cart.add(prize, 1).subscribe({
      next: () => { this.fireConfetti(); alert('Added to cart!'); },
      error: () => alert('Error adding to cart')
    });
  }

  private fireConfetti() {
    const duration = 2000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#dc3545', '#ffffff'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#dc3545', '#ffffff'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  }
}