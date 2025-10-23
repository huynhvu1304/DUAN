import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlycauhoitheospComponent } from './quanlycauhoitheosp.component';

describe('QuanlycauhoitheospComponent', () => {
  let component: QuanlycauhoitheospComponent;
  let fixture: ComponentFixture<QuanlycauhoitheospComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuanlycauhoitheospComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanlycauhoitheospComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
