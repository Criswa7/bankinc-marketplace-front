import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { CartService } from '../../../../core/services/cart.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCartItems = [
    {
      product: {
        id: 1,
        title: 'Product 1',
        price: 100,
        description: 'Description 1',
        category: 'Category 1',
        image: 'image1.jpg'
      },
      quantity: 2
    }
  ];

  beforeEach(async () => {
    const cSpy = jasmine.createSpyObj('CartService', ['getCartItems', 'processPayment', 'clearCart', 'getTotalAmount']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    cSpy.getCartItems.and.returnValue(of(mockCartItems));
    cSpy.getTotalAmount.and.returnValue(200);
    cSpy.processPayment.and.returnValue(of({ status: 'EXITOSA' }));

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent, ReactiveFormsModule],
      providers: [
        { provide: CartService, useValue: cSpy },
        { provide: Router, useValue: rSpy }
      ]
    }).compileComponents();

    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with cart items', () => {
    expect(component.cartItems).toEqual(mockCartItems);
  });

  it('should redirect if cart is empty', fakeAsync(() => {
    cartServiceSpy.getCartItems.and.returnValue(of([]));
    component.ngOnInit();
    tick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/marketplace']);
  }));

  it('should calculate item total correctly', () => {
    const total = component.getItemTotal(mockCartItems[0]);
    expect(total).toBe(200); // $100 * 2 items
  });

  it('should get total amount from cart service', () => {
    const total = component.getTotalAmount();
    expect(total).toBe(200);
    expect(cartServiceSpy.getTotalAmount).toHaveBeenCalled();
  });

  it('should validate form fields', () => {
    const form = component.checkoutForm;
    expect(form.valid).toBeFalsy();

    form.controls['cardNumber'].setValue('1234567890123456');
    form.controls['cardHolderName'].setValue('John Doe');
    form.controls['expirationDate'].setValue('12/2024');

    expect(form.valid).toBeTruthy();
  });

  it('should process payment successfully', fakeAsync(() => {
    component.checkoutForm.setValue({
      cardNumber: '1234567890123456',
      cardHolderName: 'John Doe',
      expirationDate: '12/2024'
    });

    component.onSubmit();
    tick();

    expect(cartServiceSpy.processPayment).toHaveBeenCalled();
    expect(cartServiceSpy.clearCart).toHaveBeenCalled();
    expect(component.successMessage).toBeTruthy();
    
    tick(2000);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/marketplace']);
  }));

  it('should handle payment error', fakeAsync(() => {
    cartServiceSpy.processPayment.and.returnValue(
      throwError(() => ({ error: { message: 'Payment failed' } }))
    );

    component.checkoutForm.setValue({
      cardNumber: '1234567890123456',
      cardHolderName: 'John Doe',
      expirationDate: '12/2024'
    });

    component.onSubmit();
    tick();

    expect(component.errorMessage).toBe('Payment failed');
    expect(component.loading).toBe(false);
  }));
});