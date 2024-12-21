import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { of } from 'rxjs';
import { Product } from '../../../../core/models/models';
import { By } from '@angular/platform-browser';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product 1',
      price: 100,
      description: 'Description 1',
      category: 'Category 1',
      image: 'image1.jpg'
    },
    {
      id: 2,
      title: 'Product 2',
      price: 200,
      description: 'Description 2',
      category: 'Category 2',
      image: 'image2.jpg'
    }
  ];

  beforeEach(async () => {
    const pSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'searchProducts']);
    const cSpy = jasmine.createSpyObj('CartService', ['addToCart']);

    pSpy.getProducts.and.returnValue(of(mockProducts));
    pSpy.searchProducts.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: pSpy },
        { provide: CartService, useValue: cSpy }
      ]
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productServiceSpy.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
  });

  it('should search products', fakeAsync(() => {
    component.onSearch('test');
    tick();
    
    expect(productServiceSpy.searchProducts).toHaveBeenCalledWith('test');
    expect(component.products).toEqual(mockProducts);
  }));

  it('should add product to cart', () => {
    component.addToCart(mockProducts[0]);
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(mockProducts[0]);
  });

  it('should display products in grid', () => {
    const productElements = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productElements.length).toBe(mockProducts.length);
  });

  it('should show carousel with featured products', () => {
    const carouselElement = fixture.debugElement.query(By.css('.carousel-container'));
    expect(carouselElement).toBeTruthy();
  });

  it('should navigate carousel slides', fakeAsync(() => {
    component.nextSlide();
    tick();
    expect(component.currentSlide).toBe(1);

    component.previousSlide();
    tick();
    expect(component.currentSlide).toBe(0);

    component.goToSlide(1);
    tick();
    expect(component.currentSlide).toBe(1);
  }));

  it('should show loading state', () => {
    component.loading = true;
    fixture.detectChanges();
    
    const loadingElement = fixture.debugElement.query(By.css('.loading-message'));
    expect(loadingElement).toBeTruthy();
  });

  it('should show error message', () => {
    component.errorMessage = 'Error loading products';
    fixture.detectChanges();
    
    const errorElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorElement.nativeElement.textContent).toContain('Error loading products');
  });
});