import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import SharedModule from 'app/shared/shared.module';
import { PhaserGameComponent } from '../phaser-game/phaser-game.component';
import { GameService } from '../entities/game/service/game.service';
import { IGame } from '../entities/game/game.model';
import { UserProfileService } from '../entities/user-profile/service/user-profile.service';
import { PlayerGameService } from '../entities/player-game/service/player-game.service';
import { IPlayerGame } from '../entities/player-game/player-game.model';
import { TrackerService } from '../core/tracker/tracker.service';

@Component({
  selector: 'jhi-room',
  standalone: true,
  imports: [SharedModule, RouterModule, PhaserGameComponent],
  templateUrl: './room.component.html',
})
export default class RoomComponent implements OnInit {
  game = signal<IGame | null>(null);
  shareLink = signal('');
  players = signal<IPlayerGame[]>([]);

  private readonly route = inject(ActivatedRoute);
  private readonly gameService = inject(GameService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly playerGameService = inject(PlayerGameService);
  private readonly trackerService = inject(TrackerService);

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code')!;
    this.shareLink.set(`${location.origin}/room/${code}`);
    this.gameService.findByCode(code).subscribe(res => {
      const game = res.body ?? null;
      this.game.set(game);
      if (game) {
        const sessionId = localStorage.getItem('session_id');
        if (sessionId && game.status === 'WAITING') {
          this.userProfileService.findBySession(sessionId).subscribe({
            // eslint-disable-next-line object-shorthand
            next: profileRes => {
              const profile = profileRes.body;
              if (profile?.id) {
                this.playerGameService.join({ gameId: game.id, userProfileId: profile.id }).subscribe();
              } else {
                localStorage.removeItem('session_id');
              }
            },
            // eslint-disable-next-line object-shorthand
            error: () => {
              localStorage.removeItem('session_id');
            },
          });
        }
        this.loadPlayers();
        this.trackerService.stomp.watch('/topic/games').subscribe(message => {
          const updated = JSON.parse(message.body) as IGame;
          if (updated.id === game.id) {
            this.game.set(updated);
            this.loadPlayers();
          }
        });
      }
    });
  }

  startGame(): void {
    const g = this.game();
    if (g?.id) {
      this.gameService.start(g.id).subscribe(res => {
        if (res.body) {
          this.game.set(res.body);
        }
      });
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.shareLink());
  }

  private loadPlayers(): void {
    const g = this.game();
    if (g?.id) {
      this.playerGameService.findByGame(g.id).subscribe(players => this.players.set(players));
    }
  }
}
