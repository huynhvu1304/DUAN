import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhsachproComponent } from './danhsachpro.component';

describe('DanhsachproComponent', () => {
  let component: DanhsachproComponent;
  let fixture: ComponentFixture<DanhsachproComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DanhsachproComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DanhsachproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
