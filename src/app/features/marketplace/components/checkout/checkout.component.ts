import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { CartItem } from '../../../../core/models/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      cardNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{16}$')
      ]],
      cardHolderName: ['', [
        Validators.required
      ]],
      expirationDate: ['', [
        Validators.required,
        Validators.pattern('^(0[1-9]|1[0-2])\/20[2-9][0-9]$')
      ]]
    });
  }

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/marketplace']);
      }
    });
  }

  getItemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  getTotalAmount(): number {
    return this.cartService.getTotalAmount();
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const totalAmount = this.getTotalAmount();
      const cardNumber = this.checkoutForm.get('cardNumber')?.value;

      this.cartService.processPayment(cardNumber, totalAmount).subscribe({
        next: (response) => {
          this.successMessage = 'Payment processed successfully!';
          this.cartService.clearCart();
          this.loading = false;
          
          // Redirigir después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/marketplace']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Error processing payment';
          this.loading = false;
        }
      });
    }
  }
}