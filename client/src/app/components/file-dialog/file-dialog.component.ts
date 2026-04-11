import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="file-dialog-overlay" (click)="onCancel()">
      <div class="file-dialog" (click)="$event.stopPropagation()">
        <h2>Upload Schema File</h2>
        <p class="subtitle">Upload your JSON, SQL, or TXT file</p>
        <div 
          class="drop-zone"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event)"
          (click)="fileInput.click()">
          <div *ngIf="!selectedFile" class="drop-message">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 4V16M12 4L8 8M12 4L16 8M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>Drag file here or click to select</p>
            <p class="hint">JSON, SQL, TXT</p>
          </div>
          <div *ngIf="selectedFile" class="file-info">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>{{ selectedFile.name }}</p>
          </div>
          <input 
            #fileInput 
            type="file" 
            (change)="onFileSelected($event)" 
            accept=".json,.sql,.txt"
            style="display: none;">
        </div>
        <div class="dialog-actions">
          <button class="btn-cancel" (click)="onCancel()">Cancel</button>
          <button class="btn-submit" (click)="onSubmit()" [disabled]="!selectedFile">Generate Dashboard</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .file-dialog-overlay {
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
    .file-dialog {
      background: #0f172a;
      border-radius: 16px;
      padding: 40px;
      max-width: 600px;
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
    .drop-zone {
      border: 2px dashed rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 60px 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      background: rgba(15, 23, 42, 0.6);
      margin-bottom: 24px;
    }
    .drop-zone:hover {
      border-color: #3b82f6;
      background: rgba(59, 130, 246, 0.05);
    }
    .drop-message {
      color: #94a3b8;
    }
    .drop-message svg {
      color: #3b82f6;
      margin-bottom: 16px;
    }
    .drop-message p {
      margin: 8px 0;
      font-size: 16px;
      color: #ffffff;
    }
    .hint {
      color: #64748b;
      font-size: 14px;
    }
    .file-info {
      color: #10b981;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .file-info p {
      font-weight: 600;
      font-size: 16px;
      margin: 0;
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
export class FileDialogComponent {
  private dialogRef = inject(MatDialogRef<FileDialogComponent>);

  selectedFile: File | null = null;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.selectedFile);
  }
}
