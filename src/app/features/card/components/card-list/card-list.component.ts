import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../../../core/services/transaction.service';
import { CardService } from '../../../../core/services/card.service';
import { Transaction, Card } from '../../../../core/models/models';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent {
  searchForm: FormGroup;
  transactions: Transaction[] = [];
  card: Card | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private cardService: CardService
  ) {
    this.searchForm = this.fb.group({
      cardNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{16}$')
      ]]
    });
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const cardNumber = this.searchForm.get('cardNumber')?.value;

      // Primero obtenemos los detalles de la tarjeta
      this.cardService.getCard(cardNumber).subscribe({
        next: (card) => {
          this.card = card;
          // Luego obtenemos las transacciones
          this.loadTransactions(cardNumber);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error.message || 'Card not found';
          this.card = null;
          this.transactions = [];
        }
      });
    }
  }

  private loadTransactions(cardNumber: string): void {
    this.transactionService.getTransactionsByCard(cardNumber).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error loading transactions';
        this.loading = false;
        this.transactions = [];
      }
    });
  }

  cancelTransaction(transactionId: number): void {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.transactionService.cancelTransaction(transactionId).subscribe({
      next: (transaction) => {
        this.successMessage = 'Transaction cancelled successfully';
        // Recargar las transacciones para mostrar el estado actualizado
        this.loadTransactions(this.searchForm.get('cardNumber')?.value);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error cancelling transaction';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'EXITOSA':
        return 'status-success';
      case 'RECHAZADA':
        return 'status-rejected';
      case 'ANULADA':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  canCancelTransaction(transaction: Transaction): boolean {
    if (transaction.status !== 'EXITOSA') {
      return false;
    }
    
    const transactionDate = new Date(transaction.transactionDate);
    const now = new Date();
    const hoursDifference = (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60);
    
    return hoursDifference <= 24;
  }
}