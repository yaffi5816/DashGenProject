import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://localhost:7226/api/dashboard';

  constructor(private http: HttpClient) {}

  generateFromSchema(schema: string, products?: any[], skipGemini: boolean = false): Observable<{ generatedCode: string }> {
    const components = this.getComponentsFromProducts(products);
    const schemaObj = this.parseSchema(schema);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<{ generatedCode: string }>(`${this.apiUrl}/generate`, {
      schema: schemaObj,
      components: components,
      skipGemini: skipGemini
    }, { headers }).pipe(
      catchError(error => {
        console.error('Dashboard generation error:', error);
        const errorMessage = error.error?.error || error.message || 'Unknown error occurred';
        throw new Error(errorMessage);
      })
    );
  }

  generateFromFile(file: File, products?: any[], skipGemini: boolean = false): Observable<{ generatedCode: string }> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        const schema = reader.result as string;
        this.generateFromSchema(schema, products, skipGemini).subscribe({
          next: (response) => observer.next(response),
          error: (error) => observer.error(error),
          complete: () => observer.complete()
        });
      };
      reader.readAsText(file);
    });
  }

  private parseSchema(schema: string): any {
    try {
      return JSON.parse(schema);
    } catch {
      return { rawSchema: schema };
    }
  }

  private getComponentsFromProducts(products?: any[]): string[] {
    if (!products || products.length === 0) {
      return ['BarChart', 'KPI Card', 'Table'];
    }
    return products.map(p => p.name || p.category).filter(Boolean);
  }
}
