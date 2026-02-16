import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeEditForm } from './prize-edit-form';

describe('PrizeEditForm', () => {
  let component: PrizeEditForm;
  let fixture: ComponentFixture<PrizeEditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrizeEditForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizeEditForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
