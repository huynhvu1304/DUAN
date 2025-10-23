import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlybinhluandanhgiaComponent } from './quanlybinhluandanhgia.component';

describe('QuanlybinhluandanhgiaComponent', () => {
  let component: QuanlybinhluandanhgiaComponent;
  let fixture: ComponentFixture<QuanlybinhluandanhgiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuanlybinhluandanhgiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanlybinhluandanhgiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
