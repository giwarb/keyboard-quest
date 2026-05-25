export class ArcadeAudio {
  private context?: AudioContext;
  private musicTimer?: number;
  private step = 0;

  start(): void {
    if (!this.context) this.context = new AudioContext();
    void this.context.resume();
    if (this.musicTimer) return;

    this.step = 0;
    this.musicTimer = window.setInterval(() => this.tickMusic(), 150);
  }

  stop(): void {
    if (this.musicTimer) window.clearInterval(this.musicTimer);
    this.musicTimer = undefined;
  }

  correct(): void {
    this.playTone(880, 0.055, "triangle", 0.055, 0.005);
  }

  wrong(): void {
    this.playTone(138, 0.11, "sawtooth", 0.045, 0);
  }

  wordClear(): void {
    [659, 784, 988].forEach((frequency, index) => {
      window.setTimeout(() => this.playTone(frequency, 0.075, "triangle", 0.05, 0.004), index * 45);
    });
  }

  defeat(): void {
    [523, 659, 784, 1047, 1319].forEach((frequency, index) => {
      window.setTimeout(() => this.playTone(frequency, 0.08, "square", 0.05, 0.004), index * 52);
    });
  }

  private tickMusic(): void {
    const step = this.step % 32;
    const melody = [523, 0, 659, 0, 784, 659, 587, 0, 523, 0, 784, 0, 880, 784, 659, 0];
    const bass = [130.81, 130.81, 196, 196, 174.61, 174.61, 196, 196];
    const note = melody[step % melody.length];
    if (note) this.playTone(note, 0.09, "triangle", 0.022, 0.012);
    if (step % 4 === 0) this.playTone(bass[(step / 4) % bass.length], 0.18, "sine", 0.034, 0.02);
    if (step % 8 === 0) this.playKick();
    if (step % 8 === 4) this.playNoise(0.035, 0.018);
    this.step += 1;
  }

  private playTone(frequency: number, seconds: number, type: OscillatorType, gainValue: number, attack: number): void {
    if (!this.context) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue, now + Math.max(0.001, attack));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + seconds + 0.02);
  }

  private playKick(): void {
    if (!this.context) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(92, now);
    oscillator.frequency.exponentialRampToValueAtTime(45, now + 0.12);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }

  private playNoise(seconds: number, gainValue: number): void {
    if (!this.context) return;
    const buffer = this.context.createBuffer(1, this.context.sampleRate * seconds, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    gain.gain.value = gainValue;
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(this.context.destination);
    source.start();
  }
}
