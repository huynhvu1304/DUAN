import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhsachdanhmucComponent } from './danhsachdanhmuc.component';

describe('DanhsachdanhmucComponent', () => {
  let component: DanhsachdanhmucComponent;
  let fixture: ComponentFixture<DanhsachdanhmucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DanhsachdanhmucComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DanhsachdanhmucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
