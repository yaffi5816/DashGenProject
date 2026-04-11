import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product: Product | null = null;
  quantity = 1;
  loading = true;

  getImageUrl(imgUrl: string | null): string {
    return this.productService.getImageUrl(imgUrl);
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.loading = false;
        }
      });
    }
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.router.navigate(['/cart']);
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
