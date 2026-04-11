import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schema-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  template: `
    <div class="schema-dialog-overlay" (click)="onCancel()">
      <div class="schema-dialog" (click)="$event.stopPropagation()">
        <h2>Paste Your Schema</h2>
        <p class="subtitle">Paste your JSON or SQL schema below</p>
        <textarea 
          [(ngModel)]="schema" 
          placeholder="Paste your schema here..."
          rows="15"></textarea>
        <div class="dialog-actions">
          <button class="btn-cancel" (click)="onCancel()">Cancel</button>
          <button class="btn-submit" (click)="onSubmit()" [disabled]="!schema">Generate Dashboard</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .schema-dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .schema-dialog {
      background: #0f172a;
      border-radius: 16px;
      padding: 40px;
      max-width: 700px;
      width: 90%;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    h2 {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 8px 0;
    }
    .subtitle {
      font-size: 16px;
      color: #94a3b8;
      margin: 0 0 24px 0;
    }
    textarea {
      width: 100%;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 16px;
      color: #ffffff;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      resize: vertical;
      margin-bottom: 24px;
    }
    textarea::placeholder {
      color: #64748b;
    }
    textarea:focus {
      outline: none;
      border-color: #3b82f6;
    }
    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    .btn-cancel {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-cancel:hover {
      border-color: #ef4444;
      color: #ef4444;
    }
    .btn-submit {
      background: #3b82f6;
      border: none;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-submit:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class SchemaDialogComponent {
  private dialogRef = inject(MatDialogRef<SchemaDialogComponent>);

  schema = '';

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.schema);
  }
}
