import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PrizeService } from '../../../core/services/prize-service';
import { Prize } from '../../../core/models/Prize';

import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-prize-details',
  imports: [CommonModule, RouterModule, Card, Button, Divider, Skeleton],
  templateUrl: './prize-details.html',
  styleUrls: ['./prize-details.scss'],
})
export class PrizeDetails {
  prize: Prize | null = null;

  constructor(
    private route: ActivatedRoute,
    private prizeService: PrizeService,
    private cdr: ChangeDetectorRef
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
}
