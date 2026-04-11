import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  loading = false;

  constructor() {
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';
    this.contactForm.name = `${firstName} ${lastName}`.trim();
    this.contactForm.email = localStorage.getItem('username') || '';
  }

  sendMessage() {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.subject || !this.contactForm.message) {
      alert('Please fill in all required fields');
      return;
    }

    this.loading = true;
    const emailBody = `From: ${this.contactForm.name} (${this.contactForm.email})\n\n${this.contactForm.message}`;
    
    this.http.post('http://localhost:5034/api/email/send-code', {
      email: 'batya90425@gmail.com',
      code: emailBody,
      fileName: this.contactForm.subject,
      subject: this.contactForm.subject
    }).subscribe({
      next: () => {
        this.loading = false;
        this.contactForm = { name: '', email: '', subject: '', message: '' };
        this.dialog.open(ContactSuccessDialog, { width: '400px' });
      },
      error: (error) => {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
        this.loading = false;
      }
    });
  }
}

@Component({
  selector: 'contact-success-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="success-dialog">
      <div class="success-icon">✓</div>
      <h2>Message Sent Successfully!</h2>
      <p>Your inquiry will be handled shortly</p>
      <button mat-raised-button color="primary" mat-dialog-close>OK</button>
    </div>
  `,
  styles: [`
    .success-dialog {
      text-align: center;
      padding: 20px;
    }
    .success-icon {
      width: 60px;
      height: 60px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      color: white;
      margin: 0 auto 16px;
    }
    h2 {
      color: #1f2937;
      margin-bottom: 8px;
      font-size: 20px;
    }
    p {
      color: #6b7280;
      margin-bottom: 20px;
    }
    button {
      width: 100%;
    }
  `]
})
export class ContactSuccessDialog {}
