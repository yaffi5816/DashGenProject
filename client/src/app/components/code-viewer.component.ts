import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-code-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule],
  template: `
    <div class="code-viewer-container">
      <div class="code-viewer-header">
        <h1>Your Generated Dashboard</h1>
        <p>Review your code and request changes if needed</p>
      </div>

      <div class="code-section">
        <div class="code-actions">
          <button class="btn-approve" (click)="approveCode()">
            ✓ Approve Code
          </button>
        </div>

        <textarea 
          class="code-editor" 
          [(ngModel)]="generatedCode"
          rows="25"></textarea>

        <div class="refinement-section">
          <div class="refinement-header">
            <h3>Encountered an issue?</h3>
            <p>Describe the changes you'd like to make</p>
          </div>
          <div class="refinement-input-group">
            <input 
              class="refinement-input"
              [(ngModel)]="refinementRequest" 
              placeholder="e.g., 'Make the colors blue', 'Add a pie chart'">
            <button class="btn-refine" 
                    (click)="requestRefinement()" 
                    [disabled]="!refinementRequest.trim() || refining">
              <span *ngIf="!refining">Send to Gemini</span>
              <span *ngIf="refining">Processing...</span>
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="codeApproved" class="download-modal-overlay" (click)="closeModal()">
        <div class="download-modal" (click)="$event.stopPropagation()">
          <h2>Code Approved Successfully!</h2>
          <p>How would you like to receive your dashboard code?</p>
          
          <div class="modal-actions">
            <button class="btn-download" (click)="downloadCode()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Download to Computer
            </button>
            
            <div class="email-section">
              <input 
                class="email-input"
                [(ngModel)]="email" 
                type="email" 
                placeholder="Enter your email address">
              <button class="btn-email" 
                      (click)="sendEmail()" 
                      [disabled]="!email || sending">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span *ngIf="!sending">Send via Email</span>
                <span *ngIf="sending">Sending...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .code-viewer-container {
      background: #0a0f1e;
      min-height: 100vh;
      padding: 140px 40px 40px;
      color: #ffffff;
    }
    .code-viewer-header {
      max-width: 1200px;
      margin: 0 auto 40px;
      text-align: center;
    }
    .code-viewer-header h1 {
      font-size: 42px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 12px;
    }
    .code-viewer-header p {
      font-size: 16px;
      color: #94a3b8;
    }
    .code-section {
      max-width: 1200px;
      margin: 0 auto 40px;
    }
    .code-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 16px;
    }
    .btn-approve {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-approve:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
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
      margin-top: 32px;
      padding: 24px;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .refinement-header {
      margin-bottom: 16px;
    }
    .refinement-header h3 {
      font-size: 20px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 4px 0;
    }
    .refinement-header p {
      font-size: 14px;
      color: #94a3b8;
      margin: 0;
    }
    .refinement-input-group {
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
      transition: all 0.3s;
    }
    .refinement-input::placeholder {
      color: #64748b;
    }
    .refinement-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: rgba(15, 23, 42, 0.9);
    }
    .btn-refine {
      background: #3b82f6;
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
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    .btn-refine:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .download-modal-overlay {
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
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .download-modal {
      background: #0f172a;
      border-radius: 16px;
      padding: 40px;
      max-width: 500px;
      width: 90%;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .download-modal h2 {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 12px 0;
      text-align: center;
    }
    .download-modal p {
      font-size: 16px;
      color: #94a3b8;
      margin: 0 0 32px 0;
      text-align: center;
    }
    .modal-actions {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .btn-download {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 16px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .btn-download:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    .email-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .email-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 12px 16px;
      color: #ffffff;
      font-size: 15px;
      transition: all 0.3s;
    }
    .email-input::placeholder {
      color: #64748b;
    }
    .email-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: rgba(15, 23, 42, 0.9);
    }
    .btn-email {
      background: #10b981;
      color: white;
      border: none;
      padding: 16px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .btn-email:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    }
    .btn-email:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class CodeViewerComponent implements OnInit {
  private router = inject(Router);
  private emailService = inject(EmailService);

  generatedCode = '';
  refinementRequest = '';
  codeApproved = false;
  email = '';
  refining = false;
  sending = false;

  ngOnInit(): void {
    const code = localStorage.getItem('generatedCode');
    console.log('Loading code from localStorage:', code);
    if (code) {
      this.generatedCode = code;
    } else {
      console.warn('No code found in localStorage');
    }
  }

  approveCode(): void {
    this.codeApproved = true;
  }

  closeModal(): void {
    this.codeApproved = false;
  }

  requestRefinement(): void {
    this.refining = true;
    // TODO: Call Gemini service for refinement
    setTimeout(() => {
      this.refining = false;
      this.refinementRequest = '';
      alert('Code refined successfully!');
    }, 2000);
  }

  downloadCode(): void {
    const blob = new Blob([this.generatedCode], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-component.tsx';
    a.click();
    window.URL.revokeObjectURL(url);
    this.router.navigate(['/home']);
  }

  sendEmail(): void {
    this.sending = true;
    this.emailService.sendCode(this.email, this.generatedCode, 'dashboard.html').subscribe({
      next: () => {
        this.sending = false;
        alert(`Code sent to ${this.email}`);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.sending = false;
        console.error('Error sending email:', err);
        alert('Failed to send email. Please try again.');
      }
    });
  }
}
