import { ComponentFixture, TestBed } from '@angular/core/testing';

jest.mock('phaser', () => ({
  Game: jest.fn().mockImplementation(() => ({ destroy: jest.fn() })),
  Scene: class {},
  AUTO: 0,
  GameObjects: { Image: class {} },
}));

import { PhaserGameComponent } from './phaser-game.component';

describe('PhaserGameComponent', () => {
  let component: PhaserGameComponent;
  let fixture: ComponentFixture<PhaserGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhaserGameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhaserGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
