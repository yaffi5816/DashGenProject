import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:7226/api/Products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProducts(categoryId?: number[], description?: string, minPrice?: number, maxPrice?: number, limit?: number, page?: number, sortOrder?: string): Observable<{products: Product[], total: number}> {
    let params = new HttpParams();
    
    if (categoryId && categoryId.length > 0) {
      categoryId.forEach(id => params = params.append('categoryId', id.toString()));
    }
    if (description) params = params.set('description', description);
    if (minPrice !== undefined) params = params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params = params.set('maxPrice', maxPrice.toString());
    if (limit !== undefined) params = params.set('limit', limit.toString());
    if (page !== undefined) params = params.set('page', page.toString());
    if (sortOrder) params = params.set('sortOrder', sortOrder);
    
    return this.http.get<{products: Product[], total: number}>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getImageUrl(imgUrl: string | null): string {
    if (!imgUrl) return 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800';
    if (imgUrl.startsWith('data:image')) return imgUrl;
    if (imgUrl.startsWith('http')) return imgUrl;
    return `https://localhost:7226${imgUrl}`;
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: number, product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, product);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }
}
