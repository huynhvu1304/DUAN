import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YeuthichComponent } from './yeuthich.component';

describe('YeuthichComponent', () => {
  let component: YeuthichComponent;
  let fixture: ComponentFixture<YeuthichComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YeuthichComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YeuthichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
