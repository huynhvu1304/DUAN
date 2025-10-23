import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlykhuyenmaiComponent } from './quanlykhuyenmai.component';

describe('QuanlykhuyenmaiComponent', () => {
  let component: QuanlykhuyenmaiComponent;
  let fixture: ComponentFixture<QuanlykhuyenmaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuanlykhuyenmaiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanlykhuyenmaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
