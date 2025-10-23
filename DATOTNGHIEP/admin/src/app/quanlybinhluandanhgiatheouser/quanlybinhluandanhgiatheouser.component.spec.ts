import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlybinhluandanhgiatheouserComponent } from './quanlybinhluandanhgiatheouser.component';

describe('QuanlybinhluandanhgiatheouserComponent', () => {
  let component: QuanlybinhluandanhgiatheouserComponent;
  let fixture: ComponentFixture<QuanlybinhluandanhgiatheouserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuanlybinhluandanhgiatheouserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanlybinhluandanhgiatheouserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
