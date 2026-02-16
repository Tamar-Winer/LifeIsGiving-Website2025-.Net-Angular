import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WinningService } from '../../../core/services/winning-service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-lottery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lottery.html',
  styleUrl: './lottery.scss',
})
export class Lottery implements OnInit {
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private winningService = inject(WinningService);

  purchasers: any[] = [];
  prize: any;
  
  wheelRotation = signal<number>(0); 
  isSpinning = signal<boolean>(false);
  winner = signal<any>(null);
  alreadyHadWinner = signal<boolean>(false); 
  isLoading = signal<boolean>(true); // מתחילים בטעינה כדי לבדוק בשרת

  private spinAudio: HTMLAudioElement | null = null;

  ngOnInit() {
    this.prize = this.config.data?.prize;
    this.purchasers = this.config.data?.purchases ? [...this.config.data.purchases] : [];

    // בדיקה מול השרת בטבלת Winnings האמיתית
    this.winningService.checkIfDrawn(this.prize.id).subscribe({
      next: (existingWinner: any) => {
        if (existingWinner) {
          // השרת אמר שיש זוכה - מציגים רק את מסך הניצחון
          this.winner.set(existingWinner);
          this.alreadyHadWinner.set(true);
          setTimeout(() => this.fireSuperConfetti(), 500);
        } else {
          // אין זוכה - מכינים את הגלגל להגרלה
          this.setupWheel();
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.setupWheel();
        this.isLoading.set(false);
      }
    });
  }

  setupWheel() {
    if (this.purchasers.length > 0 && this.purchasers.length < 10) {
      const fillers = ['Good Luck', 'Keep Giving', 'Blessings'];
      while (this.purchasers.length < 12) {
        this.purchasers.push({ customerFullName: fillers[this.purchasers.length % fillers.length], isFake: true });
      }
    }
  }

  startDrawing() {
    if (this.isSpinning() || this.winner() || this.alreadyHadWinner()) return;

    this.isSpinning.set(true);
    this.playSpinAudio();

    const randomAngle = Math.floor(Math.random() * 360);
    this.wheelRotation.update(v => v + 2880 + randomAngle);

    this.winningService.runLottery(this.prize.id).subscribe({
      next: (res: any) => {
        // res עכשיו מכיל את ה-WinningReportDto מהשרת
        setTimeout(() => this.finishLottery(res), 4000);
      },
      error: (err: any) => {
        this.isSpinning.set(false);
        if (this.spinAudio) this.spinAudio.pause();
        alert("This prize has already been drawn or an error occurred.");
      }
    });
  }

  playSpinAudio() {
    this.spinAudio = new Audio('assets/sounds/wheel-spin.mp3');
    this.spinAudio.loop = true;
    this.spinAudio.play().catch(() => {});
  }

  finishLottery(luckyWinner: any) {
    if (this.spinAudio) {
      this.spinAudio.pause();
      this.spinAudio = null;
    }
    this.isSpinning.set(false);
    // המרה קטנה כדי להתאים לשם השדה ב-HTML (אם צריך)
    this.winner.set({
      customerFullName: luckyWinner.winnerName || luckyWinner.customerFullName
    });
    
    new Audio('assets/sounds/victory.mp3').play().catch(() => {});
    this.fireSuperConfetti();
  }

  fireSuperConfetti() {
    const myConfetti = confetti.create(undefined, { resize: true, useWorker: false });
    myConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: 9999 });
  }

  close() { this.ref.close(); }
}