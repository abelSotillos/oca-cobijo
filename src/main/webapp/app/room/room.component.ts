import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import SharedModule from 'app/shared/shared.module';
import { PhaserGameComponent } from '../phaser-game/phaser-game.component';
import { GameService } from '../entities/game/service/game.service';
import { IGame } from '../entities/game/game.model';

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

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code')!;
    this.shareLink.set(`${location.origin}/room/${code}`);
    this.gameService.findByCode(code).subscribe(res => {
      this.game.set(res.body ?? null);
    });
  }
}
