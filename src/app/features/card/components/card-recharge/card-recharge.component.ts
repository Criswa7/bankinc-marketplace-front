import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardService } from '../../../../core/services/card.service';

@Component({
  selector: 'app-card-recharge',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-recharge.component.html',
  styleUrls: ['./card-recharge.component.css']
})
export class CardRechargeComponent {
  rechargeForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private cardService: CardService
  ) {
    this.rechargeForm = this.fb.group({
      cardNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{16}$')
      ]],
      amount: ['', [
        Validators.required,
        Validators.min(0.01)
      ]]
    });
  }

  onSubmit(): void {
    if (this.rechargeForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.cardService.rechargeCard(this.rechargeForm.value).subscribe({
        next: (response) => {
          this.successMessage = `Card recharged successfully! New balance: $${response.balance}`;
          this.loading = false;
          // Limpiar solo el monto, mantener el número de tarjeta
          this.rechargeForm.patchValue({
            amount: ''
          });
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'An error occurred while recharging the card';
          this.loading = false;
        }
      });
    }
  }
}