import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
    <div class="success-dialog">
      <div class="success-icon">✓</div>
      <h2>Dashboard Created Successfully!</h2>
      <p>Your custom dashboard has been generated and is ready for you.</p>
      <p class="price">Total: $ {{ totalAmount }}</p>
      <div class="actions">
        <button mat-button (click)="close()">Cancel</button>
        <button mat-raised-button color="primary" (click)="proceedToPayment()">
          Proceed to Payment
        </button>
      </div>
    </div>
  `,
  styles: [`
    .success-dialog {
      text-align: center;
      padding: 20px;
    }
    .success-icon {
      width: 80px;
      height: 80px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: white;
      margin: 0 auto 20px;
    }
    h2 {
      color: #1f2937;
      margin-bottom: 12px;
    }
    p {
      color: #6b7280;
      margin-bottom: 8px;
    }
    .price {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 20px 0;
    }
    .actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 24px;
    }
  `]
})
export class SuccessDialogComponent {
  private dialogRef = inject(MatDialogRef<SuccessDialogComponent>);
  private router = inject(Router);
  data = inject(MAT_DIALOG_DATA) as { totalAmount: number };

  totalAmount: string = '0.00';

  constructor() {
    this.totalAmount = (this.data?.totalAmount || 0).toFixed(2);
  }

  close(): void {
    this.dialogRef.close(false);
  }

  proceedToPayment(): void {
    this.dialogRef.close(true);
    this.router.navigate(['/payment']);
  }
}
