let audioContext: AudioContext | null = null;
let alertBuffer: AudioBuffer | null = null;
let alertBufferPromise: Promise<AudioBuffer> | null = null;
let currentSource: AudioBufferSourceNode | null = null;

function loadAlertBuffer(context: AudioContext) {
  if (alertBuffer) return Promise.resolve(alertBuffer);

  alertBufferPromise ??= fetch("/new-order-alert.mp3?v=male-2", { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) throw new Error(`Alert audio request failed: ${response.status}`);
      return response.arrayBuffer();
    })
    .then((data) => context.decodeAudioData(data))
    .then((buffer) => {
      alertBuffer = buffer;
      return buffer;
    })
    .catch((error) => {
      alertBufferPromise = null;
      throw error;
    });

  return alertBufferPromise;
}

export function unlockOrderAlertAudio() {
  try {
    if (typeof window === "undefined") return;
    audioContext ??= new AudioContext();
    const context = audioContext;

    console.log("[Audio] Unlocking. Context state:", context.state);
    if (context.state === "suspended") void context.resume();

    // Starting a silent source inside the gesture permanently unlocks Web Audio.
    const source = context.createBufferSource();
    const gain = context.createGain();
    gain.gain.value = 0;
    source.buffer = context.createBuffer(1, 1, context.sampleRate);
    source.connect(gain);
    gain.connect(context.destination);
    source.start();

    console.log("[Audio] Unlock successful. Preloading buffer...");
    void loadAlertBuffer(context).catch((error) => {
      console.warn("[Audio] Preload failed:", error);
    });
  } catch (error) {
    console.warn("[Audio] Unlock failed:", error);
  }
}

export async function playOrderAlertSound() {
  try {
    const context = audioContext;
    if (!context) {
      console.warn("[Audio] Cannot play — no AudioContext (unlock not called?)");
      return;
    }

    console.log("[Audio] Playing. Context state:", context.state);
    if (context.state === "suspended") await context.resume();
    const buffer = await loadAlertBuffer(context);

    currentSource?.stop();

    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.value = 1;
    source.connect(gain);
    gain.connect(context.destination);
    source.addEventListener("ended", () => {
      if (currentSource === source) currentSource = null;
    });
    currentSource = source;
    source.start();
    console.log("[Audio] Sound started successfully");
  } catch (error) {
    console.warn("[Audio] Play failed:", error);
  }
}
