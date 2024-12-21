import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/api/transactions`;

  constructor(private http: HttpClient) { }

  getTransactionsByCard(cardNumber: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/card/${cardNumber}`);
  }

  cancelTransaction(transactionId: number): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/${transactionId}/cancel`, {});
  }

  createTransaction(data: { cardNumber: string; amount: number }): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, data);
  }
}