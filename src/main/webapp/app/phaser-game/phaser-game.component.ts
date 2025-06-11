import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import Phaser from 'phaser';
import { MainScene, PlayerToken } from './scene';
import { IGame } from 'app/entities/game/game.model';
import { IPlayerGame } from 'app/entities/player-game/player-game.model';
import { PlayerGameService } from 'app/entities/player-game/service/player-game.service';
import { GameService } from 'app/entities/game/service/game.service';

@Component({
  selector: 'jhi-phaser-game',
  imports: [],
  templateUrl: './phaser-game.component.html',
  styleUrl: './phaser-game.component.scss',
})
export class PhaserGameComponent implements OnDestroy, OnInit, OnChanges {
  @Input({ required: true }) game: IGame | null = null;
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;

  diceValue = 0;
  currentTurn = 0;
  private myIndex = -1;
  private players: IPlayerGame[] = [];
  private phaserGame?: Phaser.Game;
  private scene?: MainScene;

  private readonly playerGameService = inject(PlayerGameService);
  private readonly gameService = inject(GameService);

  ngOnInit(): void {
    if (!this.game?.id) {
      return;
    }
    this.loadPlayers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['game'] && this.game?.id) {
      this.currentTurn = this.game.currentTurn ?? 0;
      this.loadPlayers();
    }
  }

  rollDice(): void {
    if (!this.scene || this.players.length === 0 || !this.game?.id) {
      return;
    }
    this.gameService.roll(this.game.id).subscribe(res => {
      const updatedGame = res.body;
      if (!updatedGame) {
        return;
      }
      this.currentTurn = updatedGame.currentTurn ?? 0;
      this.loadPlayers();
    });
  }

  ngOnDestroy(): void {
    this.phaserGame?.destroy(true);
  }

  private startGame(): void {
    const tokens: PlayerToken[] = this.players.map(p => ({
      id: p.id,
      color: Phaser.Display.Color.RandomRGB().color,
      position: (p.positiony ?? 0) * 8 + (p.positionx ?? 0),
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

  private loadPlayers(): void {
    if (!this.game?.id) {
      return;
    }
    this.playerGameService.findByGame(this.game.id).subscribe(players => {
      this.players = players;
      const sessionId = localStorage.getItem('session_id');
      this.myIndex = players.findIndex(p => p.userProfile?.sessionId === sessionId);

      if (!this.scene) {
        this.startGame();
      } else {
        players.forEach((p, idx) => {
          const pos = (p.positiony ?? 0) * 8 + (p.positionx ?? 0);
          this.scene!.setPlayerPosition(idx, pos);
        });
      }
    });
  }

  get isMyTurn(): boolean {
    return this.myIndex === this.currentTurn;
  }
}
