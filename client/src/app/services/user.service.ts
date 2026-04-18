import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserReadOnly, UserUpdate } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7226/api/Users';

  constructor(private http: HttpClient) {}

  getAllUsers(adminId: number): Observable<UserReadOnly[]> {
    return this.http.get<UserReadOnly[]>(`${this.apiUrl}?currentId=${adminId}`);
  }

  deleteUser(userId: number, adminId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}?currentUserId=${adminId}`);
  }

  updateUser(userId: number, user: UserUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${userId}`, user);
  }
}
