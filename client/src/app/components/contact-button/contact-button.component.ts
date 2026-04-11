import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-button',
  standalone: true,
  template: `
    <button class="contact-fab" (click)="goToContact()" title="Contact Us">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `,
  styles: [`
    .contact-fab {
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
      transition: all 0.3s;
      z-index: 1000;
    }

    .contact-fab:hover {
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 8px 30px rgba(59, 130, 246, 0.6);
    }

    @media (max-width: 768px) {
      .contact-fab {
        bottom: 20px;
        right: 20px;
        width: 56px;
        height: 56px;
      }
    }
  `]
})
export class ContactButtonComponent {
  private router = inject(Router);

  goToContact() {
    this.router.navigate(['/contact']);
  }
}
