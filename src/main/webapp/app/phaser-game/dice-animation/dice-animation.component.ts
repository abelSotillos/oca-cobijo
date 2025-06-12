import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jhi-dice-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dice-animation.component.html',
  styleUrl: './dice-animation.component.scss',
})
export class DiceAnimationComponent {
  @Input() value = 1;
  @Input() rolling = false;

  get transform(): string {
    switch (this.value) {
      case 1:
        return 'rotateX(0deg) rotateY(0deg)';
      case 2:
        return 'rotateY(-90deg)';
      case 3:
        return 'rotateY(90deg)';
      case 4:
        return 'rotateY(180deg)';
      case 5:
        return 'rotateX(-90deg)';
      case 6:
        return 'rotateX(90deg)';
      default:
        return '';
    }
  }
}
