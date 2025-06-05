import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPlayerGame } from '../player-game.model';
import { PlayerGameService } from '../service/player-game.service';

@Component({
  templateUrl: './player-game-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PlayerGameDeleteDialogComponent {
  playerGame?: IPlayerGame;

  protected playerGameService = inject(PlayerGameService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.playerGameService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
