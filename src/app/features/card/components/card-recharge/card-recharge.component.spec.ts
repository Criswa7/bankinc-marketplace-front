import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRechargeComponent } from './card-recharge.component';

describe('CardRechargeComponent', () => {
  let component: CardRechargeComponent;
  let fixture: ComponentFixture<CardRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRechargeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
