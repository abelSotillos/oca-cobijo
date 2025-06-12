import Phaser from 'phaser';

export const BOARD_ROWS = 8;
export const BOARD_COLS = 8;
export const TILE_SIZE = 64; // Default size, will be overridden for responsive layout
export interface PlayerToken {
  id: number;
  color: number;
  position: number;
  sprite?: Phaser.GameObjects.Arc;
}

export class MainScene extends Phaser.Scene {
  private players: PlayerToken[] = [];
  private tileWidth = TILE_SIZE;
  private tileHeight = TILE_SIZE;
  constructor(players: PlayerToken[]) {
    super({ key: 'MainScene' });
    this.players = players;
  }

  preload(): void {
    this.load.image('board', 'content/images/tablero.png');
  }

  create(): void {
    const board = this.add.image(0, 0, 'board').setOrigin(0, 0);

    board.setDisplaySize(this.scale.width, this.scale.height);
    this.tileWidth = this.scale.width / BOARD_COLS;
    this.tileHeight = this.scale.height / BOARD_ROWS;
    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        const x = col * this.tileWidth;
        const y = row * this.tileHeight;
        const color = (row + col) % 2 === 0 ? 0xffffff : 0xcccccc;
        const rect = this.add.rectangle(x + this.tileWidth / 2, y + this.tileHeight / 2, this.tileWidth, this.tileHeight, color, 0.1);
        rect.setStrokeStyle(1, 0x900001);
      }
    }
    this.players.forEach(p => {
      const { row, col } = this.indexToCoord(p.position);
      p.sprite = this.add.circle(
        col * this.tileWidth + this.tileWidth / 2,
        row * this.tileHeight + this.tileHeight / 2,
        Math.min(this.tileWidth, this.tileHeight) / 3,
        p.color,
      );
    });
  }

  movePlayer(index: number, steps: number): void {
    const player = this.players[index];
    player.position = (player.position + steps) % (BOARD_ROWS * BOARD_COLS);
    const { row, col } = this.indexToCoord(player.position);
    if (player.sprite) {
      this.tweens.add({
        targets: player.sprite,
        x: col * this.tileWidth + this.tileWidth / 2,
        y: row * this.tileHeight + this.tileHeight / 2,
        duration: 300,
        ease: 'Power2',
      });
    }
  }

  setPlayerPosition(index: number, position: number): void {
    const player = this.players[index];
    player.position = position % (BOARD_ROWS * BOARD_COLS);
    const { row, col } = this.indexToCoord(player.position);
    if (player.sprite) {
      player.sprite.setPosition(col * this.tileWidth + this.tileWidth / 2, row * this.tileHeight + this.tileHeight / 2);
    }
  }

  private indexToCoord(index: number): { row: number; col: number } {
    const row = Math.floor(index / BOARD_COLS);
    const col = index % BOARD_COLS;
    return { row, col };
  }
}
