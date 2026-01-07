import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrizeService } from '../../../core/services/prize-service';
import { Prize } from '../../../core/models/Prize';

@Component({
  selector: 'app-prize-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prize-list.html',
  styleUrls: ['./prize-list.scss']
})
export class PrizeList {
  prizes = signal<Prize[]>([]);

  constructor(private prizeService: PrizeService) {}

  ngOnInit(): void {
    this.prizeService.getAllPrizes().subscribe({
      next: prizes => this.prizes.set(prizes),
      error: err => console.error('Error loading prizes:', err)
    });
  }

  trackByName(index: number, prize: Prize) {
    return prize.name;
  }
}
