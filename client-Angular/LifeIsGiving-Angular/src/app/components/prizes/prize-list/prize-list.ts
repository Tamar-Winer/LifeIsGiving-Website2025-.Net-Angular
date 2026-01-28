import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PrizeService } from '../../../core/services/prize-service';
import { Prize } from '../../../core/models/Prize';

import { Card } from 'primeng/card';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-prize-list',
  imports: [CommonModule, RouterModule, Card, Button],
  templateUrl: './prize-list.html',
  styleUrls: ['./prize-list.scss']
})
export class PrizeList {
  prizes = signal<Prize[]>([]);

  constructor(private prizeService: PrizeService) {}

  ngOnInit(): void {
    this.prizeService.getAllPrizes().subscribe({
      next: (prizes) => this.prizes.set(prizes),
      error: (err) => console.error('Error loading prizes:', err)
    });
  }

  trackById(index: number, prize: Prize) {
    return prize.id;
  }

  // כרגע רק UI (אפשר לחבר לפייבוריטים בהמשך)
  toggleFavorite(prize: Prize, ev: MouseEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    console.log('favorite:', prize);
  }
}
