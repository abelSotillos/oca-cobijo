import Phaser from 'phaser';

export const BOARD_COORDS: [number, number][] = [
  [14, 2],
  [14, 7],
  [14, 11],
  [13, 14],
  [9, 14],
  [6, 14],
  [2, 14],
  [1, 11],
  [1, 8],
  [1, 4],
  [2, 1],
  [6, 1],
  [11, 1],
  [12, 5],
  [12, 8],
  [11, 11],
  [7, 11],
  [4, 11],
  [3, 7],
  [4, 4],
  [9, 4],
  [7, 7],
];
export const BOARD_ROWS = 16;
export const BOARD_COLS = 16;
export const BOARD_SIZE = BOARD_COORDS.length;
export const TILE_SIZE = 64; // Default size, will be overridden for responsive layout
export const DEFAULT_TOKEN_COLORS = [0xe57373, 0x64b5f6, 0x81c784, 0xffb74d, 0xba68c8, 0x4db6ac];
export interface PlayerToken {
  id: number;
  color: number;
  position: number;
  avatarUrl?: string | null;
  sprite?: Phaser.GameObjects.Container;
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
    this.load.image('board', 'content/images/tablero.jpg');
    this.players.forEach(p => {
      if (p.avatarUrl) {
        this.load.image(`avatar-${p.id}`, p.avatarUrl);
      }
    });
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
        const rect = this.add.rectangle(x + this.tileWidth / 2, y + this.tileHeight / 2, this.tileWidth, this.tileHeight, color, 0.0);
        rect.setStrokeStyle(0, 0x900001);
      }
    }
    this.players.forEach(p => {
      const { row, col } = this.indexToCoord(p.position);
      const x = col * this.tileWidth + this.tileWidth / 2;
      const y = row * this.tileHeight + this.tileHeight / 2;
      const radius = Math.min(this.tileWidth, this.tileHeight) / 1;
      const container = this.add.container(x, y);
      const circle = this.add.circle(0, 0, radius, p.color);
      container.add(circle);
      if (p.avatarUrl) {
        const image = this.add.image(0, 0, `avatar-${p.id}`);
        image.setDisplaySize(radius * 2, radius * 2);
        const maskGraphics = this.make.graphics({ x, y });
        maskGraphics.fillStyle(0xffffff);
        maskGraphics.fillCircle(0, 0, radius);
        image.setMask(maskGraphics.createGeometryMask());
        container.add(image);
      }
      p.sprite = container;
    });
  }

  movePlayer(index: number, steps: number): void {
    const player = this.players[index];
    this.movePlayerStepByStep(index, steps, player.position);
  }

  setPlayerPosition(index: number, position: number): void {
    const player = this.players[index];
    player.position = position % BOARD_SIZE;
    const { row, col } = this.indexToCoord(player.position);
    if (player.sprite) {
      player.sprite.setPosition(col * this.tileWidth + this.tileWidth / 2, row * this.tileHeight + this.tileHeight / 2);
    }
  }

  private movePlayerStepByStep(index: number, remainingSteps: number, currentPos: number): void {
    if (remainingSteps <= 0) return;

    const player = this.players[index];
    const nextPos = (currentPos + 1) % BOARD_SIZE;
    const { row, col } = this.indexToCoord(nextPos);

    if (player.sprite) {
      this.tweens.add({
        targets: player.sprite,
        x: col * this.tileWidth + this.tileWidth / 2,
        y: row * this.tileHeight + this.tileHeight / 2,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
          if (remainingSteps === 1) {
            player.position = nextPos;
            this.checkSpecialPosition(index, nextPos);
          } else {
            this.time.delayedCall(100, () => {
              this.movePlayerStepByStep(index, remainingSteps - 1, nextPos);
            });
          }
        },
      });
    }
  }

  private checkSpecialPosition(index: number, position: number): void {
    const isSpecialPosition = this.isSpecialPosition(position);
    if (isSpecialPosition) {
      this.time.delayedCall(2000, () => {
        const finalPosition = this.calculateFinalPosition(position);
        if (finalPosition !== position) {
          this.movePlayerToFinalPosition(index, finalPosition);
        }
      });
    }
  }

  private isSpecialPosition(position: number): boolean {
    return [2, 3, 4, 6, 8, 11, 13, 16, 17, 21].includes(position);
  }

  private calculateFinalPosition(position: number): number {
    switch (position) {
      case 2:
        return 6;
      case 4:
        return 8;
      case 6:
        return 11;
      case 8:
        return Math.max(0, 4);
      case 11:
        return 17;
      case 16:
        return 0;
      case 17:
        return 21;
      default:
        return position;
    }
  }

  private movePlayerToFinalPosition(index: number, finalPosition: number): void {
    const player = this.players[index];
    player.position = finalPosition;
    const { row, col } = this.indexToCoord(finalPosition);

    if (player.sprite) {
      this.tweens.add({
        targets: player.sprite,
        x: col * this.tileWidth + this.tileWidth / 2,
        y: row * this.tileHeight + this.tileHeight / 2,
        duration: 500,
        ease: 'Power2',
      });
    }
  }

  private indexToCoord(index: number): { row: number; col: number } {
    const [row, col] = BOARD_COORDS[index % BOARD_SIZE];
    return { row, col };
  }
}
