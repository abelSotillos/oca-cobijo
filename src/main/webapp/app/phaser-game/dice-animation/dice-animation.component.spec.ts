import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceAnimationComponent } from './dice-animation.component';

describe('DiceAnimationComponent', () => {
  let component: DiceAnimationComponent;
  let fixture: ComponentFixture<DiceAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiceAnimationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DiceAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
