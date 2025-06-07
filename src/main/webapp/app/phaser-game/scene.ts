import Phaser from 'phaser';

const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const TILE_SIZE = 64;
export class MainScene extends Phaser.Scene {
  private token!: Phaser.GameObjects.Image;
  private piece!: Phaser.GameObjects.Image;
  private position = { row: 0, col: 0 };
  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    this.load.image('board', 'content/images/tablero.jpg');
  }

  create(): void {
    const board = this.add.image(0, 0, 'board').setOrigin(0, 0);

    // Escalar para que llene toda el área
    board.setDisplaySize(this.scale.width, this.scale.height);
    // this.add.image(400, 300, 'board');
    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;
        // Opción 1: dibujar con gráficos
        const color = (row + col) % 2 === 0 ? 0xffffff : 0xcccccc;
        const rect = this.add.rectangle(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE, TILE_SIZE, color);
        rect.setStrokeStyle(1, 0x000000);
      }
    }
    // Crear ficha
    const startX = this.position.col * TILE_SIZE + TILE_SIZE / 2;
    const startY = this.position.row * TILE_SIZE + TILE_SIZE / 2;
    this.piece = this.add.image(startX, startY, 'piece').setDisplaySize(48, 48);

    // Configurar input de flechas
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' && this.position.row > 0) {
        this.position.row--;
      }
      if (event.key === 'ArrowDown' && this.position.row < BOARD_ROWS - 1) {
        this.position.row++;
      }
      if (event.key === 'ArrowLeft' && this.position.col > 0) {
        this.position.col--;
      }
      if (event.key === 'ArrowRight' && this.position.col < BOARD_COLS - 1) {
        this.position.col++;
      }

      // Mover la ficha a la nueva posición
      const newX = this.position.col * TILE_SIZE + TILE_SIZE / 2;
      const newY = this.position.row * TILE_SIZE + TILE_SIZE / 2;
      this.piece.setPosition(newX, newY);
      // this.add.image(400, 300, 'board');
      // this.token = this.add.image(100, 100, 'token');

      // // Ejemplo: mover ficha al hacer clic
      // this.input.on('pointerdown', () => {
      //   this.tweens.add({
      //     targets: this.token,
      //     x: this.token.x + 64,
      //     duration: 300,
      //     ease: 'Power2',
      //   });
      // });
    });
  }
}
