import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import SharedModule from 'app/shared/shared.module';
import { PhaserGameComponent } from '../phaser-game/phaser-game.component';
import { GameService } from '../entities/game/service/game.service';
import { IGame } from '../entities/game/game.model';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { PlayerGameService } from '../entities/player-game/service/player-game.service';
import { NewPlayerGame } from '../entities/player-game/player-game.model';

@Component({
  selector: 'jhi-room',
  standalone: true,
  imports: [SharedModule, RouterModule, PhaserGameComponent],
  templateUrl: './room.component.html',
})
export default class RoomComponent implements OnInit {
  game = signal<IGame | null>(null);
  shareLink = signal('');

  private readonly route = inject(ActivatedRoute);
  private readonly gameService = inject(GameService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly playerGameService = inject(PlayerGameService);

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code')!;
    this.shareLink.set(`${location.origin}/room/${code}`);
    this.gameService.findByCode(code).subscribe(res => {
      const game = res.body ?? null;
      this.game.set(game);
      if (game) {
        const sessionId = localStorage.getItem('session_id');
        if (sessionId) {
          this.userProfileService.findBySession(sessionId).subscribe(profileRes => {
            const profile = profileRes.body;
            if (profile && profile.id != null && game.id != null) {
              const player: NewPlayerGame = {
                id: null,
                positionx: 0,
                positiony: 0,
                order: 0,
                isWinner: false,
                game: { id: game.id },
                userProfile: { id: profile.id },
              };
              this.playerGameService.create(player).subscribe();
            }
          });
        }
      }
    });
  }
}
