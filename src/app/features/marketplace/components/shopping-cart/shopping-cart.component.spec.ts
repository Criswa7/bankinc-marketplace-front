import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartComponent } from './shopping-cart.component';
import { CartService } from '../../../../core/services/cart.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;
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
    const cSpy = jasmine.createSpyObj('CartService', [
      'getCartItems', 
      'updateQuantity', 
      'removeFromCart', 
      'clearCart', 
      'getTotalAmount'
    ]);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    cSpy.getCartItems.and.returnValue(of(mockCartItems));
    cSpy.getTotalAmount.and.returnValue(200);

    await TestBed.configureTestingModule({
      imports: [ShoppingCartComponent],
      providers: [
        { provide: CartService, useValue: cSpy },
        { provide: Router, useValue: rSpy }
      ]
    }).compileComponents();

    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart items on init', () => {
    expect(component.cartItems).toEqual(mockCartItems);
  });

  it('should update quantity', () => {
    component.updateQuantity(mockCartItems[0], 3);
    expect(cartServiceSpy.updateQuantity).toHaveBeenCalledWith(1, 3);
  });

  it('should remove item when quantity is 0', () => {
    component.updateQuantity(mockCartItems[0], 0);
    expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('should remove item', () => {
    component.removeItem(1);
    expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('should clear cart', () => {
    component.clearCart();
    expect(cartServiceSpy.clearCart).toHaveBeenCalled();
  });

  it('should calculate total amount', () => {
    const total = component.getTotalAmount();
    expect(total).toBe(200);
    expect(cartServiceSpy.getTotalAmount).toHaveBeenCalled();
  });

  it('should calculate item total', () => {
    const total = component.getItemTotal(mockCartItems[0]);
    expect(total).toBe(200); // $100 * 2 items
  });

  it('should toggle cart expansion', () => {
    expect(component.isExpanded).toBeFalse();
    component.toggleCart();
    expect(component.isExpanded).toBeTrue();
    component.toggleCart();
    expect(component.isExpanded).toBeFalse();
  });

  it('should navigate to checkout', () => {
    component.proceedToCheckout();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/checkout']);
  });

  it('should display cart items when expanded', () => {
    component.isExpanded = true;
    fixture.detectChanges();
    
    const cartItems = fixture.debugElement.queryAll(By.css('.cart-item'));
    expect(cartItems.length).toBe(mockCartItems.length);
  });

  it('should show empty cart message when no items', () => {
    cartServiceSpy.getCartItems.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();
    
    const emptyMessage = fixture.debugElement.query(By.css('.cart-empty'));
    expect(emptyMessage).toBeTruthy();
  });

  it('should update DOM when toggling cart', () => {
    const cartContainer = fixture.debugElement.query(By.css('.cart-container'));
    
    component.toggleCart();
    fixture.detectChanges();
    
    expect(cartContainer.classes['expanded']).toBeTrue();
  });
});