import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs'; 

// Services
import { PrizeService } from '../../../core/services/prize-service';
import { Prize } from '../../../core/models/Prize';
import { CartService } from '../../../core/services/cart-service';
import { AuthService } from '../../../core/services/auth-service';
import { PurchaseService } from '../../../core/services/purchase-service';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // הוסף עבור המחיקה
import { ConfirmationService, MessageService } from 'primeng/api'; // הוסף עבור המחיקה
import { ToastModule } from 'primeng/toast'; // להודעות אישור

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
    TooltipModule,
    FormsModule,
    ConfirmDialogModule, // מודול הדיאלוג
    ToastModule // מודול הודעות הצפה
  ],
  providers: [DialogService, ConfirmationService, MessageService], // הוספת הסרוויסים הדרושים
  templateUrl: './prize-list.html',
  styleUrls: ['./prize-list.scss']
})
export class PrizeList implements OnInit {
  prizes = signal<Prize[]>([]);
  isAdmin = signal<boolean>(false);

  searchFilters = {
    prizeName: '',
    donorName: '',
    exactBuyers: null as number | null
  };

  private searchSubject = new Subject<void>();

  private authService = inject(AuthService);
  private prizeService = inject(PrizeService);
  public cart = inject(CartService);
  private dialogService = inject(DialogService);
  private purchaseService = inject(PurchaseService);
  private confirmationService = inject(ConfirmationService); // סרוויס אישור מחיקה
  private messageService = inject(MessageService); // סרוויס הודעות

  ngOnInit(): void {
    this.isAdmin.set(this.authService.isAdmin());
    this.loadPrizes();

    this.searchSubject.pipe(
      debounceTime(350) 
    ).subscribe(() => {
      this.performSearch();
    });
  }

  // --- פונקציות חיפוש ---

  onSearch() {
    if (!this.searchFilters.prizeName && !this.searchFilters.donorName && this.searchFilters.exactBuyers === null) {
      this.loadPrizes();
    } else {
      this.searchSubject.next();
    }
  }

  performSearch() {
    if (!this.searchFilters.prizeName && !this.searchFilters.donorName && this.searchFilters.exactBuyers === null) {
      this.loadPrizes();
      return;
    }

    this.prizeService.searchPrizes(
      this.searchFilters.prizeName,
      this.searchFilters.donorName,
      this.searchFilters.exactBuyers
    ).subscribe({
      next: (results) => {
        this.prizes.set(results);
      },
      error: (err) => {
        console.error('Search error:', err);
        this.prizes.set([]); 
      }
    });
  }

  clearFilters() {
    this.searchFilters = { prizeName: '', donorName: '', exactBuyers: null };
    this.loadPrizes(); 
  }

  loadPrizes() {
    this.prizeService.getAllPrizes().subscribe({
      next: (prizes) => {
        this.prizes.set(prizes);
      },
      error: (err) => console.error('Error loading prizes:', err)
    });
  }

  // --- ניהול פרסים ---

  viewPurchases(prize: Prize, ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    this.purchaseService.getPurchasesByPrize(prize.id).subscribe({
      next: (data) => {
        this.dialogService.open(PurchaseList, {
          data: { purchases: data },
          header: `Purchasers List - ${prize.name}`,
          width: '600px',
        });
      },
      error: (err) => console.error('Error loading purchases:', err)
    });
  }
addPrize() {
  const ref = this.dialogService.open(PrizeEditForm, {
    width: '450px',
    showHeader: false,
    contentStyle: { 'padding': '0', 'border-radius': '20px', 'background': '#ffffff' },
    baseZIndex: 10000,
    dismissableMask: true
  });

  ref?.onClose.subscribe((newPrize: Prize) => {
    // אם חזר אובייקט מהטופס
    if (newPrize) {
      console.log('New prize received:', newPrize);
      
      // הוספה ידנית לסיגנל - זה חייב לעדכן את המסך מיד!
      this.prizes.update(prev => [newPrize, ...prev]);
    }
  });
}

editPrize(prize: Prize, ev: MouseEvent) {
  ev.preventDefault();
  ev.stopPropagation();
  
  const ref = this.dialogService.open(PrizeEditForm, {
    data: { prize: prize },
    width: '450px',
    showHeader: false,
    contentStyle: { 'padding': '0', 'border-radius': '20px', 'background': '#ffffff' },
    baseZIndex: 10000,
    dismissableMask: true
  });

  ref?.onClose.subscribe((updatedPrize: Prize) => {
    if (updatedPrize) {
      console.log('Updated prize received:', updatedPrize);

      // עדכון ידני של האיבר הספציפי בתוך הסיגנל
      this.prizes.update(all => 
        all.map(p => p.id === updatedPrize.id ? updatedPrize : p)
      );
    }
  });
}

// פונקציית המחיקה - עכשיו משתמשת בטוסט אישור
  deletePrize(prizeId: number, ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    
    // מציג טוסט אישור עם מפתח מיוחד
    this.messageService.add({
      key: 'confirmDelete',
      sticky: true,
      severity: 'warn',
      summary: 'Delete Confirmation',
      detail: 'Are you sure you want to delete this prize?',
      data: prizeId // מעבירים את ה-ID לטוסט
    });
  }

onConfirmDelete(prizeId: number) {
  this.messageService.clear('confirmDelete');

  this.prizeService.deletePrize(prizeId).subscribe({
    next: () => {
      this.prizes.update(all => all.filter(p => p.id !== prizeId));
      
      // הודעת הצלחה יוקרתית (תופיע בזכות ה-SCSS החדש)
      setTimeout(() => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Successfully Removed', 
          detail: 'The prize has been deleted from the catalog.', 
          life: 3000 
        });
      }, 150);
    },
    error: (err) => {
      setTimeout(() => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Delete Failed', 
          detail: 'Cannot delete this prize (check if it has purchasers).',
          life: 5000
        });
      }, 150);
    }
  });
}

  // ביטול מתוך הטוסט
  onRejectDelete() {
    this.messageService.clear('confirmDelete');
  }

  // --- לוגיקת משתמש ---

  addToCart(prize: Prize, ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this.cart.add(prize, 1).subscribe({
      next: () => { 
        this.fireConfetti(); 
      },
      error: () => alert('Error adding to cart')
    });
    window.location.reload();
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


  sortPrizes(event: any) {
    const criteria = event.target.value;
    const currentPrizes = [...this.prizes()];

    switch (criteria) {
      case 'price-asc':
        currentPrizes.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        currentPrizes.sort((a, b) => b.price - a.price);
        break;
      case 'category':
        currentPrizes.sort((a, b) => String(a.category).localeCompare(String(b.category)));
        break;
      case 'name':
        currentPrizes.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    this.prizes.set(currentPrizes);
  }

  onRunLottery(prize: Prize, ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    this.purchaseService.getPurchasesByPrize(prize.id).subscribe({
      next: (purchasers) => {
        if (purchasers.length === 0) {
          this.messageService.add({ 
            severity: 'warn', 
            summary: 'No Tickets', 
            detail: 'No purchasers for this prize yet!' 
          });
          return;
        }

        this.dialogService.open(Lottery, {
          data: { 
            purchases: purchasers,
            prize: prize 
          },
          header: 'Live Lottery Draw',
          width: '550px',
          contentStyle: { 'padding': '0', 'border-radius': '24px' },
          showHeader: false
        });
      }
    });
  }
}