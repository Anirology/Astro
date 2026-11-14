export type Cue =
  "tap" | "pick" | "drop" | "reveal" | "success" | "retry" | "insight"
  | "match" | "sparkle" | "level" | "step" | "chat" | "xp";
let audio: AudioContext | null = null;

const notes: Record<
  Cue,
  { tones: [number, number, number?][]; wave: OscillatorType; volume: number }
> = {
  tap: { tones: [[620, 0, .055]], wave: "triangle", volume: 0.023 },
  pick: {
    tones: [
      [440, 0, .08],
      [660, 0.06, .11],
    ],
    wave: "triangle",
    volume: 0.03,
  },
  drop: {
    tones: [
      [310, 0, .08],
      [470, 0.07, .12],
      [390, 0.14, .08],
    ],
    wave: "triangle",
    volume: 0.035,
  },
  reveal: {
    tones: [
      [523, 0, .18],
      [659, 0.11, .18],
      [784, 0.22, .24],
    ],
    wave: "sine",
    volume: 0.035,
  },
  success: {
    tones: [
      [523, 0, .12],
      [659, 0.1, .12],
      [784, 0.2, .14],
      [1047, 0.32, .28],
    ],
    wave: "triangle",
    volume: 0.045,
  },
  retry: {
    tones: [
      [330, 0],
      [294, 0.12],
    ],
    wave: "sine",
    volume: 0.025,
  },
  insight: {
    tones: [
      [659, 0],
      [880, 0.1],
    ],
    wave: "sine",
    volume: 0.035,
  },
  match: { tones: [[587, 0, .08], [784, .06, .08], [988, .14, .12], [1175, .23, .23]], wave: "triangle", volume: .038 },
  sparkle: { tones: [[1047, 0, .08], [1319, .06, .1], [1568, .14, .18]], wave: "sine", volume: .028 },
  xp: { tones: [[784, 0, .23], [1175, .09, .27], [1568, .2, .36]], wave: "sine", volume: .042 },
  level: { tones: [[392, 0, .13], [523, .12, .13], [659, .24, .13], [784, .36, .15], [1047, .5, .34]], wave: "triangle", volume: .044 },
  step: { tones: [[294, 0, .06], [392, .055, .08]], wave: "square", volume: .014 },
  chat: { tones: [[698, 0, .08], [880, .075, .13]], wave: "sine", volume: .025 },
};

export function playCue(cue: Cue, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  try {
    audio ??= new AudioContext();
    if (audio.state === "suspended") void audio.resume();
    const pattern = notes[cue];
    const now = audio.currentTime + 0.005;
    for (const [frequency, delay, duration = .15] of pattern.tones) {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = pattern.wave;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(
        pattern.volume,
        now + delay + 0.015,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start(now + delay);
      oscillator.stop(now + delay + duration + .01);
    }
  } catch {
    // The game remains playable when audio output is unavailable.
  }
}
