import Phaser from "phaser";
import { emitGameEvent, onGameEvent } from "../adapters/eventBus";

export class GameScene extends Phaser.Scene {
  private enemyParts: Phaser.GameObjects.GameObject[] = [];
  private heroParts: Phaser.GameObjects.GameObject[] = [];
  private slash?: Phaser.GameObjects.Arc;
  private aura?: Phaser.GameObjects.Particles.ParticleEmitter;
  private currentBoss = false;

  constructor() {
    super("GameScene");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#2b3637");
    this.drawDungeon();
    this.drawHero();
    this.drawGolem(false);
    this.makeSparkTexture();

    this.aura = this.add.particles(0, 0, "spark", {
      lifespan: 420,
      speed: { min: 60, max: 190 },
      angle: { min: 235, max: 310 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 0.8, end: 0 },
      tint: [0x55fff0, 0xffffff, 0x76b7ff],
      quantity: 0,
      emitting: false
    });

    onGameEvent((event) => {
      if (event.type === "state") this.updateBossPose(event.state.target.isBoss);
      if (event.type === "typing") this.playTypingEvent(event);
      if (event.type === "restart") this.scene.restart();
    });
  }

  private drawDungeon(): void {
    const g = this.add.graphics();
    g.fillStyle(0x2a3435, 1).fillRect(0, 0, 1024, 768);
    g.fillStyle(0x334043, 1).fillRect(0, 0, 1024, 260);
    g.fillStyle(0x263133, 1).fillRect(0, 548, 1024, 220);
    g.lineStyle(3, 0x465456, 0.6);
    for (let x = 0; x < 1024; x += 128) g.lineBetween(x, 0, x, 548);
    for (let y = 0; y < 548; y += 86) g.lineBetween(0, y, 1024, y);
    g.fillStyle(0x151d20, 0.24).fillRect(0, 260, 1024, 288);
    g.lineStyle(8, 0x171f21, 0.7).strokeRect(10, 10, 1004, 748);
    g.lineStyle(3, 0x607174, 0.45).strokeRect(18, 18, 988, 732);
  }

  private drawHero(): void {
    const x = 190;
    const y = 348;
    const g = this.add.graphics();
    this.heroParts.push(g);

    g.fillStyle(0x0c1626, 1).fillTriangle(x - 54, y + 18, x - 112, y + 118, x - 18, y + 116);
    g.fillStyle(0x1d3b68, 1).fillTriangle(x - 58, y + 20, x - 98, y + 108, x - 20, y + 100);
    g.fillStyle(0xd9dde2, 1).fillRoundedRect(x - 34, y - 14, 68, 92, 8);
    g.fillStyle(0x2d4d73, 1).fillRoundedRect(x - 24, y + 2, 48, 62, 5);
    g.fillStyle(0xf0c28a, 1).fillCircle(x, y - 54, 31);
    g.fillStyle(0x6b3b22, 1).fillTriangle(x - 38, y - 72, x + 28, y - 93, x + 16, y - 38);
    g.fillTriangle(x - 32, y - 68, x - 54, y - 38, x - 12, y - 44);
    g.fillStyle(0x10151a, 1).fillCircle(x - 11, y - 54, 4).fillCircle(x + 13, y - 54, 4);
    g.lineStyle(4, 0x10151a, 1).lineBetween(x - 8, y - 36, x + 14, y - 35);
    g.fillStyle(0xe9edf2, 1).fillCircle(x - 50, y + 8, 22).fillCircle(x + 48, y + 8, 22);
    g.fillStyle(0xf2c15a, 1).fillRect(x - 32, y + 74, 24, 52).fillRect(x + 8, y + 74, 24, 52);
    g.fillStyle(0xd9dde2, 1).fillRoundedRect(x - 42, y + 120, 38, 14, 5).fillRoundedRect(x + 4, y + 120, 42, 14, 5);

    const sword = this.add.graphics();
    this.heroParts.push(sword);
    sword.lineStyle(14, 0x36ffde, 0.82).lineBetween(x + 56, y - 10, x + 140, y - 110);
    sword.lineStyle(7, 0xeaffff, 1).lineBetween(x + 56, y - 10, x + 140, y - 110);
    sword.fillStyle(0xf7d25c, 1).fillCircle(x + 52, y - 6, 13);
    this.tweens.add({ targets: sword, alpha: 0.45, duration: 380, yoyo: true, repeat: -1 });
  }

  private drawGolem(boss: boolean): void {
    this.currentBoss = boss;
    this.enemyParts.forEach((part) => part.destroy());
    this.enemyParts = [];
    const x = 812;
    const y = boss ? 330 : 346;
    const scale = boss ? 1.12 : 1;
    const g = this.add.graphics();
    this.enemyParts.push(g);

    g.fillStyle(0x0d1415, 0.5).fillEllipse(x + 10, y + 138, 190 * scale, 34);
    const rock = boss ? 0x8b6e51 : 0x8a8170;
    const dark = boss ? 0x4a3528 : 0x554f45;
    g.fillStyle(rock, 1).fillRoundedRect(x - 58 * scale, y - 86 * scale, 116 * scale, 112 * scale, 10);
    g.fillRoundedRect(x - 86 * scale, y - 18 * scale, 48 * scale, 78 * scale, 10);
    g.fillRoundedRect(x + 38 * scale, y - 18 * scale, 48 * scale, 78 * scale, 10);
    g.fillRoundedRect(x - 94 * scale, y + 52 * scale, 54 * scale, 78 * scale, 8);
    g.fillRoundedRect(x + 40 * scale, y + 52 * scale, 54 * scale, 78 * scale, 8);
    g.fillRoundedRect(x - 70 * scale, y + 120 * scale, 58 * scale, 22 * scale, 6);
    g.fillRoundedRect(x + 12 * scale, y + 120 * scale, 58 * scale, 22 * scale, 6);
    g.fillStyle(rock, 1).fillRoundedRect(x - 55 * scale, y - 150 * scale, 110 * scale, 76 * scale, 12);
    g.lineStyle(5, dark, 1);
    g.strokeRoundedRect(x - 55 * scale, y - 150 * scale, 110 * scale, 76 * scale, 12);
    g.lineBetween(x - 35 * scale, y - 128 * scale, x + 20 * scale, y - 148 * scale);
    g.lineBetween(x + 5 * scale, y - 74 * scale, x + 52 * scale, y - 102 * scale);
    g.fillStyle(0x9effd1, 1).fillRect(x - 28 * scale, y - 114 * scale, 16 * scale, 10 * scale);
    g.fillRect(x + 18 * scale, y - 114 * scale, 16 * scale, 10 * scale);
    g.lineStyle(5, 0x101516, 1).lineBetween(x - 24 * scale, y - 88 * scale, x + 30 * scale, y - 88 * scale);
    g.lineStyle(4, dark, 0.9);
    for (let i = -3; i <= 3; i += 1) g.lineBetween(x + i * 22 * scale, y - 72 * scale, x + i * 20 * scale, y + 20 * scale);

    this.tweens.add({
      targets: g,
      y: boss ? -8 : -4,
      duration: boss ? 420 : 760,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  private updateBossPose(isBoss: boolean): void {
    if (isBoss && !this.currentBoss) {
      this.drawGolem(true);
      this.cameras.main.shake(140, 0.004);
    } else if (!isBoss && this.currentBoss) {
      this.drawGolem(false);
    }
  }

  private makeSparkTexture(): void {
    const spark = this.add.graphics();
    spark.fillStyle(0xffffff, 1).fillCircle(8, 8, 8);
    spark.generateTexture("spark", 16, 16);
    spark.destroy();
  }

  private playTypingEvent(event: Extract<Parameters<typeof emitGameEvent>[0], { type: "typing" }>): void {
    const enemy = this.enemyParts[0];
    if (!enemy) return;
    if (event.event.type === "wrong") {
      this.cameras.main.shake(110, 0.008);
      this.addHitText("MISS", 512, 256, 0xff7777);
      return;
    }

    this.aura?.explode(10, 330, 250);
    if (event.event.wordCompleted) {
      this.slashAttack(event.event.targetDefeated);
      this.addHitText(event.event.targetDefeated ? "BREAK!" : "HIT!", 730, 214, event.event.targetDefeated ? 0xfff173 : 0x76fff2);
    } else {
      this.tweens.add({ targets: this.heroParts, x: 4, duration: 50, yoyo: true, repeat: 1 });
    }
  }

  private slashAttack(defeated: boolean): void {
    this.slash?.destroy();
    this.slash = this.add.arc(700, 250, 110, 300, 40, false, 0x72fff5, 0.42);
    this.slash.setStrokeStyle(10, 0xeaffff, 0.95);
    this.tweens.add({
      targets: this.slash,
      x: 790,
      y: 292,
      alpha: 0,
      scale: 1.8,
      duration: 210,
      ease: "Cubic.easeOut",
      onComplete: () => this.slash?.destroy()
    });
    this.cameras.main.flash(defeated ? 160 : 70, 120, 255, 238);
    this.cameras.main.shake(defeated ? 180 : 70, defeated ? 0.011 : 0.004);
    this.tweens.add({ targets: this.enemyParts, x: defeated ? 26 : 10, duration: 55, yoyo: true, repeat: defeated ? 5 : 2 });
  }

  private addHitText(text: string, x: number, y: number, color: number): void {
    const label = this.add.text(x, y, text, {
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: "34px",
      color: `#${color.toString(16).padStart(6, "0")}`,
      stroke: "#000000",
      strokeThickness: 6
    }).setOrigin(0.5);
    this.tweens.add({
      targets: label,
      y: y - 52,
      alpha: 0,
      scale: 1.35,
      duration: 560,
      ease: "Cubic.easeOut",
      onComplete: () => label.destroy()
    });
  }
}
