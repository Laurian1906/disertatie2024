import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelModeComponent } from './level-mode.component';

describe('LevelModeComponent', () => {
  let component: LevelModeComponent;
  let fixture: ComponentFixture<LevelModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelModeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LevelModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
