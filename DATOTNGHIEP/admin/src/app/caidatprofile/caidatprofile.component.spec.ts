import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaidatprofileComponent } from './caidatprofile.component';

describe('CaidatprofileComponent', () => {
  let component: CaidatprofileComponent;
  let fixture: ComponentFixture<CaidatprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaidatprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaidatprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
