import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhsachbrandComponent } from './danhsachbrand.component';

describe('DanhsachbrandComponent', () => {
  let component: DanhsachbrandComponent;
  let fixture: ComponentFixture<DanhsachbrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DanhsachbrandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DanhsachbrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
