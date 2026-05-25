export class ArcadeAudio {
  private context?: AudioContext;
  private musicTimer?: number;

  start(): void {
    if (!this.context) this.context = new AudioContext();
    void this.context.resume();
    if (this.musicTimer) return;
    let step = 0;
    const notes = [261.63, 329.63, 392, 523.25, 392, 329.63];
    this.musicTimer = window.setInterval(() => {
      this.playTone(notes[step % notes.length], 0.035, "sine", 0.025);
      step += 1;
    }, 220);
  }

  stop(): void {
    if (this.musicTimer) window.clearInterval(this.musicTimer);
    this.musicTimer = undefined;
  }

  correct(): void {
    this.playTone(740, 0.045, "triangle", 0.05);
  }

  wrong(): void {
    this.playTone(150, 0.08, "sawtooth", 0.04);
  }

  defeat(): void {
    [523, 659, 784, 1047].forEach((frequency, index) => {
      window.setTimeout(() => this.playTone(frequency, 0.07, "square", 0.045), index * 55);
    });
  }

  private playTone(frequency: number, seconds: number, type: OscillatorType, gainValue: number): void {
    if (!this.context) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = gainValue;
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + seconds);
    oscillator.stop(this.context.currentTime + seconds);
  }
}
