import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import Phaser from 'phaser';
import { MainScene, PlayerToken } from './scene';
import { IGame } from 'app/entities/game/game.model';
import { IPlayerGame } from 'app/entities/player-game/player-game.model';
import { PlayerGameService } from 'app/entities/player-game/service/player-game.service';

@Component({
  selector: 'jhi-phaser-game',
  imports: [],
  templateUrl: './phaser-game.component.html',
  styleUrl: './phaser-game.component.scss',
})
export class PhaserGameComponent implements OnDestroy, OnInit {
  @Input({ required: true }) game: IGame | null = null;
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;

  diceValue = 0;
  currentTurn = 0;
  private players: IPlayerGame[] = [];
  private phaserGame?: Phaser.Game;
  private scene?: MainScene;

  private readonly playerGameService = inject(PlayerGameService);

  ngOnInit(): void {
    if (!this.game?.id) {
      return;
    }
    this.playerGameService.findByGame(this.game.id).subscribe(players => {
      this.players = players;
      this.startGame();
    });
  }

  rollDice(): void {
    if (!this.scene || this.players.length === 0) {
      return;
    }
    this.diceValue = Phaser.Math.Between(1, 6);
    this.scene.movePlayer(this.currentTurn, this.diceValue);
    this.currentTurn = (this.currentTurn + 1) % this.players.length;
  }

  private startGame(): void {
    const tokens: PlayerToken[] = this.players.map(p => ({
      id: p.id!,
      color: Phaser.Display.Color.RandomRGB().color,
      position: 0,
    }));
    this.scene = new MainScene(tokens);
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: this.gameContainer.nativeElement,
      scene: [this.scene],
    };
    this.phaserGame = new Phaser.Game(config);
  }

  ngOnDestroy(): void {
    this.phaserGame?.destroy(true);
  }
}
