import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card, CardCreationDTO, CardRechargeDTO } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = `${environment.apiUrl}/api/cards`;

  constructor(private http: HttpClient) { }

  createCard(card: CardCreationDTO): Observable<Card> {
    return this.http.post<Card>(this.apiUrl, card);
  }

  rechargeCard(recharge: CardRechargeDTO): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/recharge`, recharge);
  }

  getCard(cardNumber: string): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/${cardNumber}`);
  }
}