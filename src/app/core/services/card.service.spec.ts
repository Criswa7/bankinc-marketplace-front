import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CardService } from './card.service';
import { CardType } from '../models/models';
import { environment } from '../../../environments/environment';

describe('CardService', () => {
  let service: CardService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/cards`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CardService]
    });
    service = TestBed.inject(CardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a card', () => {
    const mockCard = {
      id: 1,
      cardNumber: '1234567890123456',
      holderName: 'John Doe',
      cardType: CardType.DEBITO,
      balance: 0,
      expirationDate: '2024-12-31'
    };

    const createCardDto = {
      holderName: 'John Doe',
      cardType: CardType.DEBITO,
      productId: '123456'
    };

    service.createCard(createCardDto).subscribe(card => {
      expect(card).toEqual(mockCard);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockCard);
  });

  it('should recharge a card', () => {
    const mockCard = {
      id: 1,
      cardNumber: '1234567890123456',
      holderName: 'John Doe',
      cardType: CardType.DEBITO,
      balance: 100,
      expirationDate: '2024-12-31'
    };

    const rechargeDto = {
      cardNumber: '1234567890123456',
      amount: 100
    };

    service.rechargeCard(rechargeDto).subscribe(card => {
      expect(card).toEqual(mockCard);
    });

    const req = httpMock.expectOne(`${apiUrl}/recharge`);
    expect(req.request.method).toBe('POST');
    req.flush(mockCard);
  });

  it('should get a card by number', () => {
    const mockCard = {
      id: 1,
      cardNumber: '1234567890123456',
      holderName: 'John Doe',
      cardType: CardType.DEBITO,
      balance: 100,
      expirationDate: '2024-12-31'
    };

    service.getCard('1234567890123456').subscribe(card => {
      expect(card).toEqual(mockCard);
    });

    const req = httpMock.expectOne(`${apiUrl}/1234567890123456`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCard);
  });
});