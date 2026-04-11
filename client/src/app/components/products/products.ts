import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory = 'All';
  searchQuery = '';
  searchTimeout: any;
  loading = true;
  quantities: { [key: number]: number } = {};
  currentPage = 1;
  pageSize = 9;
  totalProducts = 0;
  totalPages = 0;
  isAdmin = false;
  showModal = false;
  editingProduct: Product | null = null;
  sortOrder = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  productForm: Product = {
    productId: 0,
    categoryId: 0,
    categoryName: '',
    productName: '',
    productDescreption: '',
    price: 0,
    imgUrl: ''
  };

  get categoriesForForm(): Category[] {
    return this.categories.filter(c => c.categoryName !== 'All');
  }

  getImageUrl(imgUrl: string | null): string {
    return this.productService.getImageUrl(imgUrl);
  }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    this.isAdmin = this.authService.isAdmin();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadProducts() {
    this.loading = true;
    console.log('Loading products...');
    const categoryIds = this.selectedCategory !== 'All' ? 
      [this.categories.find(c => c.categoryName === this.selectedCategory)?.categoryId].filter(id => id !== undefined) as number[] : 
      undefined;
    
    this.productService.getProducts(categoryIds, this.searchQuery || undefined, this.minPrice || undefined, this.maxPrice || undefined, this.pageSize, this.currentPage, this.sortOrder || undefined).subscribe({
      next: (data) => {
        console.log('Products loaded:', data);
        this.products = data.products;
        this.totalProducts = data.total;
        this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  onSearchChange() {
    this.currentPage = 1;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.loadProducts();
    }, 300);
  }

  onPriceChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSortChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  filterByCategory(categoryName: string) {
    console.log('Filtering by category:', categoryName);
    this.selectedCategory = categoryName;
    this.currentPage = 1;
    this.loadProducts();
  }

  get filteredProducts() {
    return this.products;
  }

  selectProduct(product: Product) {
    this.router.navigate(['/product', product.productId]);
  }

  addToCart(product: Product, quantity: number = 1) {
    this.cartService.addToCart(product, quantity);
  }

  getQuantity(productId: number): number {
    return this.quantities[productId] || 1;
  }

  setQuantity(productId: number, quantity: number) {
    this.quantities[productId] = Math.max(1, quantity);
  }

  incrementQuantity(productId: number) {
    this.quantities[productId] = (this.quantities[productId] || 1) + 1;
  }

  decrementQuantity(productId: number) {
    const current = this.quantities[productId] || 1;
    this.quantities[productId] = current > 1 ? current - 1 : 1;
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo(0, 0);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
      window.scrollTo(0, 0);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
      window.scrollTo(0, 0);
    }
  }

  get pages(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => console.error('Error deleting product:', error)
      });
    }
  }

  editProduct(product: Product) {
    this.editingProduct = product;
    this.productForm = { ...product };
    this.showModal = true;
  }

  addNewProduct() {
    this.editingProduct = null;
    this.productForm = {
      productId: 0,
      categoryId: 0,
      categoryName: '',
      productName: '',
      productDescreption: '',
      price: 0,
      imgUrl: ''
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingProduct = null;
  }

  saveProduct() {
    const selectedCategory = this.categories.find(c => c.categoryId === this.productForm.categoryId);
    const productToSave = {
      productId: this.productForm.productId,
      categoryId: this.productForm.categoryId,
      categoryName: selectedCategory?.categoryName || '',
      productName: this.productForm.productName,
      productDescreption: this.productForm.productDescreption,
      price: this.productForm.price,
      imgUrl: this.productForm.imgUrl
    };

    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.productId, productToSave as Product).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (error) => console.error('Error updating product:', error)
      });
    } else {
      this.productService.addProduct(productToSave as Product).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (error) => console.error('Error adding product:', error)
      });
    }
  }

  removeImage() {
    this.productForm.imgUrl = '';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.productForm.imgUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  showAllProducts() {
    this.selectedCategory = 'All';
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadProducts();
  }
}
