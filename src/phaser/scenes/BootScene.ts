import Phaser from "phaser";
import { ASSETS } from "../../game/assets/manifest";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload(): void {
    this.load.spritesheet(ASSETS.enemySheet, ASSETS.enemySheetPath, {
      frameWidth: 512,
      frameHeight: 512
    });
  }

  create(): void {
    this.scene.start("GameScene");
  }
}
