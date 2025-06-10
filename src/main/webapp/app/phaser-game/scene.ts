import Phaser from 'phaser';

export const BOARD_ROWS = 8;
export const BOARD_COLS = 8;
export const TILE_SIZE = 64;
export interface PlayerToken {
  id: number;
  color: number;
  position: number;
  sprite?: Phaser.GameObjects.Arc;
}

export class MainScene extends Phaser.Scene {
  private players: PlayerToken[] = [];
  constructor(players: PlayerToken[]) {
    super({ key: 'MainScene' });
    this.players = players;
  }

  preload(): void {
    this.load.image('board', 'content/images/tablero.jpg');
  }

  create(): void {
    const board = this.add.image(0, 0, 'board').setOrigin(0, 0);

    board.setDisplaySize(this.scale.width, this.scale.height);
    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;
        const color = (row + col) % 2 === 0 ? 0xffffff : 0xcccccc;
        const rect = this.add.rectangle(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE, color);
        rect.setStrokeStyle(1, 0x000000);
      }
    }
    this.players.forEach(p => {
      const { row, col } = this.indexToCoord(p.position);
      p.sprite = this.add.circle(col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2, 20, p.color);
    });
  }

  movePlayer(index: number, steps: number): void {
    const player = this.players[index];
    player.position = (player.position + steps) % (BOARD_ROWS * BOARD_COLS);
    const { row, col } = this.indexToCoord(player.position);
    if (player.sprite) {
      this.tweens.add({
        targets: player.sprite,
        x: col * TILE_SIZE + TILE_SIZE / 2,
        y: row * TILE_SIZE + TILE_SIZE / 2,
        duration: 300,
        ease: 'Power2',
      });
    }
  }

  private indexToCoord(index: number): { row: number; col: number } {
    const row = Math.floor(index / BOARD_COLS);
    const col = index % BOARD_COLS;
    return { row, col };
  }
}
