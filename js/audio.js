let audioCtx = null;
let gainNode = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = parseFloat(document.getElementById('volume-slider').value);
    gainNode.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Karplus-Strong pluck — used by note burst
function pluck(stringId, fret) {
  const ctx = getCtx();
  const freq = OPEN_FREQ[stringId] * Math.pow(2, fret / 12);
  const sr = ctx.sampleRate;
  const N = Math.round(sr / freq);
  const totalSamples = Math.round(sr * 2.5);

  const ring = new Float32Array(N);
  for (let i = 0; i < N; i++) ring[i] = Math.random() * 2 - 1;

  const out = new Float32Array(totalSamples);
  let p = 0;
  for (let i = 0; i < totalSamples; i++) {
    const next = (p + 1) % N;
    out[i] = ring[p];
    ring[p] = 0.498 * (ring[p] + ring[next]);
    p = next;
  }

  const buf = ctx.createBuffer(1, totalSamples, sr);
  buf.copyToChannel(out, 0);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(gainNode);
  src.start();
}

// Sustained triangle tone — used by ear training
function playTone(freq, startTime, duration) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0, startTime);
  env.gain.linearRampToValueAtTime(0.4, startTime + 0.04);
  env.gain.setValueAtTime(0.4, startTime + duration - 0.08);
  env.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.connect(env);
  env.connect(gainNode);
  osc.start(startTime);
  osc.stop(startTime + duration);
}
