import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { TransactionService } from './transaction.service';
import { of } from 'rxjs';
import { Product } from '../models/models';

describe('CartService', () => {
  let service: CartService;
  let transactionServiceSpy: jasmine.SpyObj<TransactionService>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test Description',
    category: 'Test Category',
    image: 'test.jpg'
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('TransactionService', ['createTransaction']);
    spy.createTransaction.and.returnValue(of({ id: 1, status: 'EXITOSA' }));

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: TransactionService, useValue: spy }
      ]
    });
    service = TestBed.inject(CartService);
    transactionServiceSpy = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add item to cart', () => {
    service.addToCart(mockProduct);
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].product).toEqual(mockProduct);
      expect(items[0].quantity).toBe(1);
    });
  });

  it('should increase quantity when adding same product', () => {
    service.addToCart(mockProduct);
    service.addToCart(mockProduct);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
    });
  });

  it('should remove item from cart', () => {
    service.addToCart(mockProduct);
    service.removeFromCart(mockProduct.id);
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should update item quantity', () => {
    service.addToCart(mockProduct);
    service.updateQuantity(mockProduct.id, 3);
    
    service.getCartItems().subscribe(items => {
      expect(items[0].quantity).toBe(3);
    });
  });

  it('should clear cart', () => {
    service.addToCart(mockProduct);
    service.clearCart();
    
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should calculate total amount correctly', () => {
    service.addToCart(mockProduct);
    service.addToCart(mockProduct);
    
    const total = service.getTotalAmount();
    expect(total).toBe(200); // 2 items * $100
  });

  it('should process payment', () => {
    service.processPayment('1234567890123456', 100).subscribe(response => {
      expect(response.status).toBe('EXITOSA');
    });

    expect(transactionServiceSpy.createTransaction).toHaveBeenCalledWith({
      cardNumber: '1234567890123456',
      amount: 100
    });
  });
});