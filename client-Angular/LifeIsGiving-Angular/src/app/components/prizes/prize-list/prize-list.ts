import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Services
import { PrizeService } from '../../../core/services/prize-service';
import { Prize } from '../../../core/models/Prize';
import { CartService } from '../../../core/services/cart-service';
import { AuthService } from '../../../core/services/auth-service';
import { PurchaseService } from '../../../core/services/purchase-service'; // שירות הרכישות

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip'; // מודול לטולטיפ

// Components & Extras
import confetti from 'canvas-confetti';
import { PrizeEditForm } from '../prize-edit-form/prize-edit-form';
import { PurchaseList } from '../../manager/purchase-list/purchase-list'; 
import { Lottery } from '../../manager/lottery/lottery';


@Component({
  selector: 'app-prize-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    CardModule, 
    ButtonModule, 
    TooltipModule
  ],
  providers: [DialogService],
  templateUrl: './prize-list.html',
  styleUrls: ['./prize-list.scss']
})
export class PrizeList implements OnInit {
  prizes = signal<Prize[]>([]);
  isAdmin = signal<boolean>(false);

  // Injections
  private authService = inject(AuthService);
  private prizeService = inject(PrizeService);
  public cart = inject(CartService);
  private dialogService = inject(DialogService);
  private purchaseService = inject(PurchaseService); // הזרקה חדשה

  ngOnInit(): void {
    // עדכון סטטוס מנהל
    this.isAdmin.set(this.authService.isAdmin());

    // טעינת הפרסים מהשרת
    this.prizeService.getAllPrizes().subscribe({
      next: (prizes) => this.prizes.set(prizes),
      error: (err) => console.error('Error loading prizes:', err)
    });
  }

viewPurchases(prize: Prize, ev: MouseEvent) {
  ev.preventDefault();
  ev.stopPropagation();

  // הקריאה לשירות עם ה-ID של הפרס הספציפי
  this.purchaseService.getPurchasesByPrize(prize.id).subscribe({
    next: (data) => {
      this.dialogService.open(PurchaseList, {
        data: { 
          purchases: data // כאן יכנסו רק הרכישות שהשרת סינן עבורנו
        },
        header: `רשימת רוכשים - ${prize.name}`,
        width: '600px',
        // ... שאר ההגדרות
      });
    },
    error: (err) => console.error('Error loading purchases:', err)
  });
}

  // --- פונקציות קיימות (ללא שינוי) ---

  addPrize() {
    const ref = this.dialogService.open(PrizeEditForm, {
      width: '450px',
      showHeader: false,
      contentStyle: { 
        'padding': '0', 
        'border-radius': '20px', 
        'overflow': 'hidden',
        'background': '#ffffff'
      },
      baseZIndex: 10000,
      dismissableMask: true
    });

    if (ref) {
      ref.onClose.subscribe((newPrize: Prize) => {
        if (newPrize) {
          this.prizes.update(prev => [newPrize, ...prev]);
        }
      });
    }
  }

  editPrize(prize: Prize, ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    
    const ref = this.dialogService.open(PrizeEditForm, {
      data: { prize: prize },
      width: '450px',
      showHeader: false,
      contentStyle: { 
        'padding': '0', 
        'border-radius': '20px', 
        'overflow': 'hidden',
        'background': '#ffffff'
      },
      baseZIndex: 10000,
      dismissableMask: true
    });

    if (ref) {
      ref.onClose.subscribe((updatedPrize: Prize) => {
        if (updatedPrize) {
          this.prizes.update(all => 
            all.map(p => p.id === updatedPrize.id ? updatedPrize : p)
          );
        }
      });
    }
  }

  deletePrize(prizeId: number, ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    
    if (confirm('Are you sure you want to delete this prize?')) {
      this.prizeService.deletePrize(prizeId).subscribe({
        next: () => {
          this.prizes.set(this.prizes().filter(p => p.id !== prizeId));
        },
        error: (err) => {
          console.error('Error deleting prize:', err);
          alert('Error deleting prize');
        }
      });
    }
  }

  addToCart(prize: Prize, ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this.cart.add(prize, 1).subscribe({
      next: () => { 
        this.fireConfetti(); 
      },
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

  trackById(index: number, prize: Prize) { return prize.id; }
  toggleFavorite(prize: Prize, ev: MouseEvent) { ev.preventDefault(); ev.stopPropagation(); }



  onRunLottery(prize: Prize, ev: MouseEvent) {
  ev.preventDefault();
  ev.stopPropagation();

  // קודם נשלח בקשה לקבל את הרוכשים כדי להזין את הספינר
  this.purchaseService.getPurchasesByPrize(prize.id).subscribe({
    next: (purchasers) => {
      if (purchasers.length === 0) {
        alert('No purchasers for this prize yet!');
        return;
      }

      // פתיחת חלונית ההגרלה עם הספינר
      this.dialogService.open(Lottery, {
        data: { 
          purchases: purchasers,
          prize: prize 
        },
        header: 'Live Lottery Draw',
        width: '550px',
        contentStyle: { 'padding': '0', 'border-radius': '24px' },
        showHeader: false // אנחנו רוצים עיצוב נקי
      });
    }
  });
}
}