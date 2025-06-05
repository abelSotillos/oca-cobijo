import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IPlayerGame } from '../player-game.model';

@Component({
  selector: 'jhi-player-game-detail',
  templateUrl: './player-game-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class PlayerGameDetailComponent {
  playerGame = input<IPlayerGame | null>(null);

  previousState(): void {
    window.history.back();
  }
}
