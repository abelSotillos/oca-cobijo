import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IGame } from '../game.model';

@Component({
  selector: 'jhi-game-detail',
  templateUrl: './game-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class GameDetailComponent {
  game = input<IGame | null>(null);

  previousState(): void {
    window.history.back();
  }
}
