import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserReadOnly, UserUpdate } from '../../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);

  users: UserReadOnly[] = [];
  loading = true;
  editingUser: UserUpdate | null = null;
  editingUserId: number | null = null;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const currentUserId = parseInt(localStorage.getItem('userId') || '0');
    if (currentUserId === 0) {
      console.error('No valid user ID found in localStorage');
      this.loading = false;
      return;
    }
    this.userService.getAllUsers(currentUserId).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
      }
    });
  }

  editUser(user: UserReadOnly) {
    this.editingUserId = user.userId;
    this.editingUser = {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin
    };
  }

  saveUser() {
    if (this.editingUser && this.editingUserId) {
      this.userService.updateUser(this.editingUserId, this.editingUser).subscribe({
        next: () => {
          this.loadUsers();
          this.editingUser = null;
          this.editingUserId = null;
        },
        error: (error) => console.error('Error updating user:', error)
      });
    }
  }

  cancelEdit() {
    this.editingUser = null;
    this.editingUserId = null;
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      const currentUserId = parseInt(localStorage.getItem('userId') || '0');
      this.userService.deleteUser(userId, currentUserId).subscribe({
        next: () => this.loadUsers(),
        error: (error) => console.error('Error deleting user:', error)
      });
    }
  }
}
