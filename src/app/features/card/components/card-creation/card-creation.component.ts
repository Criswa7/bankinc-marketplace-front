import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardService } from '../../../../core/services/card.service';
import { CardType } from '../../../../core/models/models';

@Component({
  selector: 'app-card-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-creation.component.html',
  styleUrls: ['./card-creation.component.css']
})
export class CardCreationComponent {
  cardForm: FormGroup;
  cardTypes = Object.values(CardType);
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private cardService: CardService
  ) {
    this.cardForm = this.fb.group({
      holderName: ['', [Validators.required]],
      cardType: ['', [Validators.required]],
      productId: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.cardService.createCard(this.cardForm.value).subscribe({
        next: (response) => {
          this.successMessage = `Card created successfully! Card number: ${response.cardNumber}`;
          this.cardForm.reset();
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'An error occurred while creating the card';
          this.loading = false;
        }
      });
    }
  }
}