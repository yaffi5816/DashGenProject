import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  projectId?: number;
  orderId: number;
  dashboardCode: string;
  createdDate?: Date;
  status: 'pending' | 'approved' | 'completed';
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private apiUrl = 'https://localhost:7226/api/Projects';

  constructor(private http: HttpClient) {}

  getUserProjects(userId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/user/${userId}`);
  }

  getProjectById(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${projectId}`);
  }

  approveProject(projectId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${projectId}/approve`, {});
  }
}
