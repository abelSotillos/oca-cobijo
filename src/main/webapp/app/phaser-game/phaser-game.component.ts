import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import Phaser from 'phaser';
import { MainScene, PlayerToken, BOARD_SIZE, DEFAULT_TOKEN_COLORS } from './scene';
import { IGame } from 'app/entities/game/game.model';
import { IPlayerGame } from 'app/entities/player-game/player-game.model';
import { PlayerGameService } from 'app/entities/player-game/service/player-game.service';
import { GameService } from 'app/entities/game/service/game.service';
import { IRollResult } from 'app/entities/game/roll-result.model';
import { TrackerService } from 'app/core/tracker/tracker.service';
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
  private readonly trackerService = inject(TrackerService);

  ngOnInit(): void {
    if (!this.game?.id) {
      return;
    }
    this.loadPlayers();
    this.trackerService.stomp.watch('/topic/dice').subscribe(message => {
      const roll = JSON.parse(message.body) as IRollResult;
      if (roll.game.id === this.game?.id) {
        this.handleRollResult(roll);
      }
    });
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
    this.rolling = true;
    this.gameService.roll(this.game.id).subscribe(res => {
      const roll = res.body;
      if (roll) {
        this.handleRollResult(roll);
      } else {
        this.rolling = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.phaserGame?.destroy(true);
  }

  private handleRollResult(roll: IRollResult): void {
    this.diceValue = roll.dice;
    this.currentTurn = roll.game.currentTurn ?? 0;
    this.showDice = true;
    setTimeout(() => {
      this.loadPlayers();
      this.showDice = false;
      this.rolling = false;
    }, 1000);
  }

  private startGame(): void {
    const tokens: PlayerToken[] = this.players.map(p => ({
      id: p.id,
      color: DEFAULT_TOKEN_COLORS[Math.floor(Math.random() * DEFAULT_TOKEN_COLORS.length)],
      position: p.position ?? 0,
      avatarUrl: p.userProfile?.avatarUrl ?? null,
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
          const pos = p.position ?? 0;
          if (prevPlayers[idx]) {
            const oldPos = prevPlayers[idx].position ?? 0;
            const total = BOARD_SIZE;
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
