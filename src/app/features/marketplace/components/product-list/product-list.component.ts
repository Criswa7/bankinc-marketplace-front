import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { Product } from '../../../../core/models/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductSearchComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  featuredProducts: Product[] = [];
  currentSlide = 0;
  loading = false;
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    // Iniciar el carrusel automático
    setInterval(() => this.nextSlide(), 5000);
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        // Seleccionar los primeros 5 productos para el carrusel
        this.featuredProducts = products.slice(0, 5);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading products';
        this.loading = false;
      }
    });
  }

  onSearch(query: string): void {
    this.loading = true;
    if (!query) {
      this.loadProducts();
      return;
    }

    this.productService.searchProducts(query).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error searching products';
        this.loading = false;
      }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.featuredProducts.length;
  }

  previousSlide(): void {
    this.currentSlide = this.currentSlide === 0 
      ? this.featuredProducts.length - 1 
      : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}