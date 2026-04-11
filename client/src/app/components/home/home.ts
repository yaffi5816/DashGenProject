import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private router = inject(Router);

  startNewProject() {
    this.router.navigate(['/products']);
  }

  viewProjects() {
    this.router.navigate(['/orders']);
  }
}
