import Phaser from "phaser";
import { ASSETS, ENEMY_FRAME } from "../../game/assets/manifest";
import { EnemyKind } from "../../game/simulation/state";
import { emitGameEvent, onGameEvent } from "../adapters/eventBus";

export class GameScene extends Phaser.Scene {
  private enemy?: Phaser.GameObjects.Sprite;
  private stars?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super("GameScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#10284a");
    this.add.rectangle(480, 300, 960, 600, 0x173b66);
    this.add.circle(170, 130, 90, 0xffd166, 0.18);
    this.add.circle(790, 90, 130, 0x4ecdc4, 0.16);
    this.add.rectangle(480, 506, 960, 188, 0x0a1d35, 0.35);

    this.enemy = this.add.sprite(480, 270, ASSETS.enemySheet, 0).setScale(0.46);
    this.add.text(480, 66, "KEYBOARD QUEST", {
      fontFamily: "Arial, sans-serif",
      fontSize: "28px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.stars = this.add.particles(0, 0, "enemy-sheet", {
      frame: 1,
      lifespan: 450,
      speed: { min: 120, max: 260 },
      scale: { start: 0.05, end: 0 },
      alpha: { start: 0.85, end: 0 },
      quantity: 0,
      emitting: false
    });

    onGameEvent((event) => {
      if (event.type === "state") this.setEnemy(event.state.target.enemyKind);
      if (event.type === "typing") this.playTypingEvent(event);
      if (event.type === "restart") this.scene.restart();
    });
  }

  private setEnemy(kind: EnemyKind): void {
    this.enemy?.setFrame(ENEMY_FRAME[kind]);
  }

  private playTypingEvent(event: Extract<Parameters<typeof emitGameEvent>[0], { type: "typing" }>): void {
    if (!this.enemy) return;
    if (event.event.type === "wrong") {
      this.cameras.main.shake(80, 0.006);
      this.tweens.add({
        targets: this.enemy,
        x: { from: 464, to: 496 },
        duration: 42,
        yoyo: true,
        repeat: 2
      });
      return;
    }

    this.tweens.add({
      targets: this.enemy,
      scale: { from: 0.42, to: 0.49 },
      duration: 90,
      yoyo: true,
      ease: "Sine.easeOut"
    });
    if (event.event.targetDefeated) {
      this.stars?.explode(24, this.enemy.x, this.enemy.y);
      this.cameras.main.flash(110, 255, 224, 102);
      this.tweens.add({
        targets: this.enemy,
        y: { from: 250, to: 285 },
        alpha: { from: 0.3, to: 1 },
        duration: 180,
        ease: "Back.easeOut"
      });
    }
  }
}
