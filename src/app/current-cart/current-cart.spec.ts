import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentCart } from './current-cart';

describe('CurrentCart', () => {
  let component: CurrentCart;
  let fixture: ComponentFixture<CurrentCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrentCart],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentCart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
