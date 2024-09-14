import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftModeComponent } from './shift-mode.component';

describe('ShiftModeComponent', () => {
  let component: ShiftModeComponent;
  let fixture: ComponentFixture<ShiftModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftModeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
