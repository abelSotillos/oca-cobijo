import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Phaser from 'phaser';
import { MainScene } from './scene';

@Component({
  selector: 'jhi-phaser-game',
  imports: [],
  templateUrl: './phaser-game.component.html',
  styleUrl: './phaser-game.component.scss',
})
export class PhaserGameComponent implements OnDestroy, OnInit {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;

  private phaserGame?: Phaser.Game;

  ngOnInit(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: this.gameContainer.nativeElement,
      scene: [MainScene],
    };

    this.phaserGame = new Phaser.Game(config);
  }

  ngOnDestroy(): void {
    this.phaserGame?.destroy(true);
  }
}
