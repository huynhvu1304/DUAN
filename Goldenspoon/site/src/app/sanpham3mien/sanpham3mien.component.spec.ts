import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sanpham3mienComponent } from './sanpham3mien.component';

describe('Sanpham3mienComponent', () => {
  let component: Sanpham3mienComponent;
  let fixture: ComponentFixture<Sanpham3mienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sanpham3mienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sanpham3mienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
