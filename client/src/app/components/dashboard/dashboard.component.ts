import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DashboardService } from '../../services/dashboard.service';
import { CartService } from '../../services/cart.service';
import { SchemaDialogComponent } from '../schema-dialog/schema-dialog.component';
import { FileDialogComponent } from '../file-dialog/file-dialog.component';
import { SuccessDialogComponent } from '../success-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Upload Your Schema</h1>
        <p>Provide your data structure in JSON or SQL format</p>
      </div>

      <div class="upload-options">
        <div class="upload-card" (click)="openFileDialog()">
          <div class="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 4V16M12 4L8 8M12 4L16 8M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>Upload File</h3>
          <p>JSON, SQL, or TXT file</p>
        </div>

        <div class="upload-card" (click)="openSchemaDialog()">
          <div class="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>Paste Schema</h3>
          <p>Or paste it directly below</p>
        </div>
      </div>

      <div class="skip-gemini-container">
        <label class="skip-gemini-label">
          <input type="checkbox" [(ngModel)]="skipGemini">
          <span>דלג על Gemini (השתמש ב-HTML דמה)</span>
        </label>
      </div>

      <div *ngIf="false" class="schema-input-section">
        <div class="skip-gemini-option">
          <label>
            <input type="checkbox" [(ngModel)]="skipGemini">
            <span>דלג על Gemini (השתמש ב-HTML דמה)</span>
          </label>
        </div>
        <textarea 
          class="schema-textarea" 
          [placeholder]="placeholderText"
          [(ngModel)]="schemaText"
          rows="15"></textarea>
        <button class="btn-generate" (click)="generateFromText()" [disabled]="!schemaText || loading">
          <span *ngIf="!loading">Generate Dashboard</span>
          <span *ngIf="loading">Generating...</span>
        </button>
      </div>

      <div *ngIf="loading" class="loading-overlay">
        <mat-spinner></mat-spinner>
        <p>Generating Dashboard...</p>
      </div>

      <div *ngIf="showCodeEditor && !loading" class="code-editor-section">
        <div class="code-editor-header">
          <h2>Generated Code</h2>
          <div class="code-actions">
            <button class="btn-cancel" (click)="cancelCode()">Cancel</button>
            <button class="btn-approve" (click)="approveCode()">Approve & Preview</button>
          </div>
        </div>
        <textarea 
          class="code-editor" 
          [(ngModel)]="generatedCode"
          rows="25"></textarea>
        <div class="refinement-section">
          <input 
            type="text" 
            class="refinement-input" 
            [(ngModel)]="refinementRequest" 
            placeholder="Request changes (e.g., 'Make the colors blue', 'Add a header')">
          <button class="btn-refine" (click)="requestRefinement()" [disabled]="!refinementRequest.trim()">
            Send to Gemini for Refinement
          </button>
        </div>
      </div>

      <div *ngIf="generatedHtml && !loading && !showCodeEditor" class="preview-section">
        <h2>Preview</h2>
        <iframe [srcdoc]="generatedHtml"></iframe>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      background: #0a0f1e;
      min-height: 100vh;
      padding: 140px 40px 40px;
      color: #ffffff;
    }
    .dashboard-header {
      max-width: 1200px;
      margin: 0 auto 60px;
      text-align: center;
    }
    .dashboard-header h1 {
      font-size: 48px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 12px;
    }
    .dashboard-header p {
      font-size: 18px;
      color: #94a3b8;
    }
    .upload-options {
      max-width: 1200px;
      margin: 0 auto 32px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }
    .skip-gemini-container {
      max-width: 1200px;
      margin: 0 auto 60px;
      display: flex;
      justify-content: center;
    }
    .skip-gemini-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 16px;
      color: #94a3b8;
      padding: 12px 20px;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s;
    }
    .skip-gemini-label:hover {
      background: rgba(15, 23, 42, 0.8);
      border-color: rgba(59, 130, 246, 0.3);
    }
    .skip-gemini-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin-left: 12px;
      cursor: pointer;
    }
    .skip-gemini-label span {
      user-select: none;
    }
    .upload-card {
      background: rgba(15, 23, 42, 0.8);
      border: 2px dashed rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 48px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    }
    .upload-card:hover {
      border-color: #3b82f6;
      background: rgba(59, 130, 246, 0.05);
      transform: translateY(-4px);
    }
    .upload-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 24px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
    }
    .upload-card h3 {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .upload-card p {
      font-size: 14px;
      color: #94a3b8;
    }
    .schema-input-section {
      max-width: 1200px;
      margin: 0 auto;
    }
    .skip-gemini-option {
      margin-bottom: 20px;
      padding: 16px;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 8px;
    }
    .skip-gemini-option label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 16px;
      color: #94a3b8;
    }
    .skip-gemini-option input[type="checkbox"] {
      width: 20px;
      height: 20px;
      margin-left: 12px;
      cursor: pointer;
    }
    .skip-gemini-option span {
      user-select: none;
    }
    .schema-textarea {
      width: 100%;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 24px;
      color: #ffffff;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      resize: vertical;
      margin-bottom: 20px;
    }
    .schema-textarea::placeholder {
      color: #64748b;
    }
    .btn-generate {
      width: 100%;
      background: #3b82f6;
      color: white;
      border: none;
      padding: 16px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-generate:hover:not(:disabled) {
      background: #2563eb;
      transform: translateY(-2px);
    }
    .btn-generate:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .loading-overlay {
      text-align: center;
      padding: 60px;
      color: #94a3b8;
    }
    .preview-section {
      max-width: 1200px;
      margin: 60px auto 0;
    }
    .preview-section h2 {
      font-size: 32px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 24px;
    }
    iframe {
      width: 100%;
      height: 800px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      background: white;
    }
    .code-editor-section {
      max-width: 1200px;
      margin: 60px auto 0;
    }
    .code-editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .code-editor-header h2 {
      font-size: 32px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
    .code-actions {
      display: flex;
      gap: 12px;
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
    .btn-approve {
      background: #10b981;
      border: none;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-approve:hover {
      background: #059669;
      transform: translateY(-2px);
    }
    .code-editor {
      width: 100%;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 24px;
      color: #ffffff;
      font-size: 13px;
      font-family: 'Courier New', monospace;
      resize: vertical;
      margin-bottom: 20px;
    }
    .refinement-section {
      display: flex;
      gap: 12px;
    }
    .refinement-input {
      flex: 1;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 12px 16px;
      color: #ffffff;
      font-size: 15px;
    }
    .refinement-input::placeholder {
      color: #64748b;
    }
    .btn-refine {
      background: #f59e0b;
      border: none;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
    }
    .btn-refine:hover:not(:disabled) {
      background: #d97706;
      transform: translateY(-2px);
    }
    .btn-refine:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class DashboardComponent {
  private dialog = inject(MatDialog);
  private dashboardService = inject(DashboardService);
  private sanitizer = inject(DomSanitizer);
  private cartService = inject(CartService);

  generatedHtml: SafeHtml | null = null;
  generatedCode = '';
  showCodeEditor = false;
  loading = false;
  schemaText = '';
  refinementRequest = '';
  skipGemini = false;
  placeholderText = `Paste your schema here...

Example JSON:
{
  "users": {
    "id": "string",
    "name": "string",
    "email": "string"
  },
  "products": {
    "id": "string",
    "name": "string",
    "price": "number"
  }
}`;

  get selectedProducts() {
    return this.cartService.getItems().map(item => ({
      name: item.product.productName,
      category: item.product.categoryName,
      description: item.product.productDescreption,
      quantity: item.quantity
    }));
  }

  openSchemaDialog(): void {
    const dialogRef = this.dialog.open(SchemaDialogComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'fullscreen-dialog',
      hasBackdrop: false
    });

    dialogRef.afterClosed().subscribe(schema => {
      if (schema) {
        this.generateFromSchema(schema);
      }
    });
  }

  openFileDialog(): void {
    const dialogRef = this.dialog.open(FileDialogComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'fullscreen-dialog',
      hasBackdrop: false
    });

    dialogRef.afterClosed().subscribe(file => {
      if (file) {
        this.generateFromFile(file);
      }
    });
  }

  generateFromSchema(schema: string): void {
    this.loading = true;
    const cartItems = this.cartService.getItems();
    const totalAmount = this.cartService.getTotalPrice();
    localStorage.setItem('orderItems', JSON.stringify(cartItems));
    localStorage.setItem('orderTotal', totalAmount.toString());
    localStorage.setItem('originalSchema', schema);
    
    this.dashboardService.generateFromSchema(schema, this.selectedProducts, this.skipGemini).subscribe({
      next: (response) => {
        const decodedCode = this.decodeHtmlEntities(response.generatedCode);
        this.generatedCode = decodedCode;
        localStorage.setItem('generatedCode', decodedCode);
        this.loading = false;
        
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          width: '500px',
          disableClose: true,
          data: { totalAmount }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          this.showCodeEditor = true;
        });
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Error generating Dashboard: ' + error.message);
        this.loading = false;
      }
    });
  }

  generateFromFile(file: File): void {
    this.loading = true;
    const reader = new FileReader();
    reader.onload = () => {
      const schema = reader.result as string;
      localStorage.setItem('originalSchema', schema);
    };
    reader.readAsText(file);
    
    const cartItems = this.cartService.getItems();
    const totalAmount = this.cartService.getTotalPrice();
    localStorage.setItem('orderItems', JSON.stringify(cartItems));
    localStorage.setItem('orderTotal', totalAmount.toString());
    
    this.dashboardService.generateFromFile(file, this.selectedProducts, this.skipGemini).subscribe({
      next: (response) => {
        const decodedCode = this.decodeHtmlEntities(response.generatedCode);
        this.generatedCode = decodedCode;
        localStorage.setItem('generatedCode', decodedCode);
        this.loading = false;
        
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          width: '500px',
          disableClose: true,
          data: { totalAmount }
        });
        
        dialogRef.afterClosed().subscribe(result => {
          this.showCodeEditor = true;
        });
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Error generating Dashboard: ' + error.message);
        this.loading = false;
      }
    });
  }

  approveCode(): void {
    this.generatedHtml = this.sanitizer.bypassSecurityTrustHtml(this.generatedCode);
    this.showCodeEditor = false;
  }

  cancelCode(): void {
    this.showCodeEditor = false;
    this.generatedCode = '';
  }

  generateFromText(): void {
    if (this.schemaText) {
      this.generateFromSchema(this.schemaText);
    }
  }

  requestRefinement(): void {
    alert('Refinement feature coming soon!');
  }

  private decodeHtmlEntities(text: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }
}
