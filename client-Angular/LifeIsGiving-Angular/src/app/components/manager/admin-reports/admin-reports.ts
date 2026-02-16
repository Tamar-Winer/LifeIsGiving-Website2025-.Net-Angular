import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WinningService } from '../../../core/services/winning-service';
import { TableModule } from 'primeng/table'; // נשתמש בטבלה של PrimeNG אם יש לך

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.scss'
})
export class AdminReports implements OnInit {
  private winningService = inject(WinningService);

  winnersReport = signal<any[]>([]);
  totalIncome = signal<number>(0);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // טעינת דוח זוכים
    this.winningService.getWinnersReport().subscribe({
      next: (data) => this.winnersReport.set(data),
      error: (err) => console.error('Error loading winners report', err)
    });

    // טעינת סך הכנסות
    this.winningService.getTotalIncome().subscribe({
      next: (data) => {
        this.totalIncome.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading income', err);
        this.isLoading.set(false);
      }
    });
  }
}