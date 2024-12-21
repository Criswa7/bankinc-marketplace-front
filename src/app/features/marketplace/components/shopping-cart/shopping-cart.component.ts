import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { CartItem } from '../../../../core/models/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isExpanded = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(item.product.id);
    } else {
      this.cartService.updateQuantity(item.product.id, quantity);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getTotalAmount(): number {
    return this.cartService.getTotalAmount();
  }

  getItemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  toggleCart(): void {
    this.isExpanded = !this.isExpanded;
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}