import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeDetails } from './prize-details';

describe('PrizeDetails', () => {
  let component: PrizeDetails;
  let fixture: ComponentFixture<PrizeDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrizeDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizeDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
