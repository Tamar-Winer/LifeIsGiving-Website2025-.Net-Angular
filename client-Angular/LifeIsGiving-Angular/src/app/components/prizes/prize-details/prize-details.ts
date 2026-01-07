import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PrizeService } from '../../../core/services/prize-service';
import { Prize } from '../../../core/models/Prize';

@Component({
  selector: 'app-prize-details',
  standalone: true,
  imports: [CommonModule],
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
    // מאזין לכל שינוי ב־params
    this.route.params.subscribe(params => {
      const id = +params['id'];
      console.log('Route param id:', id);
      if (id) {
        this.prizeService.getPrizeById(id).subscribe({
          next: prize => {
            this.prize = prize;
            this.cdr.detectChanges(); // מכריח Angular לרענן את ה־template
          },
          error: err => console.error('Error loading prize:', err)
        });
      }
    });
  }
}
