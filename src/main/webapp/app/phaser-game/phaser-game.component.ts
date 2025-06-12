import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import Phaser from 'phaser';
import { MainScene, PlayerToken, coordToIndex, VALID_PATH } from './scene';
import { IGame } from 'app/entities/game/game.model';
import { IPlayerGame } from 'app/entities/player-game/player-game.model';
import { PlayerGameService } from 'app/entities/player-game/service/player-game.service';
import { GameService } from 'app/entities/game/service/game.service';
import { DiceAnimationComponent } from './dice-animation/dice-animation.component';

@Component({
  selector: 'jhi-phaser-game',
  imports: [DiceAnimationComponent],
  templateUrl: './phaser-game.component.html',
  styleUrl: './phaser-game.component.scss',
})
export class PhaserGameComponent implements OnDestroy, OnInit, OnChanges {
  @Input({ required: true }) game: IGame | null = null;
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;

  diceValue = 0;
  showDice = false;
  rolling = false;
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (changes['game'] && this.game?.id) {
      this.currentTurn = this.game.currentTurn ?? 0;
      this.loadPlayers();
    }
  }

  rollDice(): void {
    if (!this.scene || this.players.length === 0 || !this.game?.id) {
      return;
    }
    this.diceValue = Math.floor(Math.random() * 6) + 1;
    this.showDice = true;
    this.rolling = true;
    setTimeout(() => {
      this.rolling = false;
      this.gameService.roll(this.game!.id).subscribe(res => {
        const updatedGame = res.body;
        if (!updatedGame) {
          return;
        }
        this.currentTurn = updatedGame.currentTurn ?? 0;
        this.loadPlayers();
        setTimeout(() => {
          this.showDice = false;
        }, 500);
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    this.phaserGame?.destroy(true);
  }

  private startGame(): void {
    const tokens: PlayerToken[] = this.players.map(p => ({
      id: p.id,
      color: Phaser.Display.Color.RandomRGB().color,
      position: coordToIndex(p.positiony ?? 0, p.positionx ?? 0),
    }));
    this.scene = new MainScene(tokens);
    const containerWidth = this.gameContainer.nativeElement.offsetWidth || window.innerWidth;
    const width = Math.min(800, containerWidth);
    const height = width * 0.7;
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width,
      height,
      parent: this.gameContainer.nativeElement,
      scene: [this.scene],
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    };
    this.phaserGame = new Phaser.Game(config);
  }

  private loadPlayers(): void {
    if (!this.game?.id) {
      return;
    }
    this.playerGameService.findByGame(this.game.id).subscribe(players => {
      const prevPlayers = this.players;
      this.players = players;
      const sessionId = localStorage.getItem('session_id');
      this.myIndex = players.findIndex(p => p.userProfile?.sessionId === sessionId);

      if (!this.scene) {
        this.startGame();
      } else {
        players.forEach((p, idx) => {
          const pos = coordToIndex(p.positiony ?? 0, p.positionx ?? 0);
          if (prevPlayers[idx]) {
            const oldPos = coordToIndex(prevPlayers[idx].positiony ?? 0, prevPlayers[idx].positionx ?? 0);
            const total = VALID_PATH.length;
            let steps = pos - oldPos;
            if (steps < 0) {
              steps += total;
            }
            if (steps !== 0) {
              this.scene!.movePlayer(idx, steps);
            }
          } else {
            this.scene!.setPlayerPosition(idx, pos);
          }
        });
      }
    });
  }

  get isMyTurn(): boolean {
    return this.myIndex === this.currentTurn;
  }
}
