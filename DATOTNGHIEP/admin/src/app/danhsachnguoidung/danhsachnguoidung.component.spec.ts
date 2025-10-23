import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhsachnguoidungComponent } from './danhsachnguoidung.component';

describe('DanhsachnguoidungComponent', () => {
  let component: DanhsachnguoidungComponent;
  let fixture: ComponentFixture<DanhsachnguoidungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DanhsachnguoidungComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DanhsachnguoidungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
